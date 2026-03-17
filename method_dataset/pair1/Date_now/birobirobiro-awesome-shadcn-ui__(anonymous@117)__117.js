function __method_wrapper__() {
    async (
      octokit: Octokit,
      submission: SubmissionData,
      userInfo: { login: string; name?: string },
    ): Promise<PRSubmissionResult> => {
      setIsSubmitting(true);
      setError(null);
      setSubmissionStatus(STATUS_MESSAGES.STARTING);

      try {
        const userLogin = userInfo.login;

        setSubmissionStatus(STATUS_MESSAGES.CHECKING_FORK);

        // Check if user already has a fork, create one if not
        let fork;
        try {
          // Try to get existing fork
          const { data: existingFork } = await octokit.rest.repos.get({
            owner: userLogin,
            repo: GITHUB_CONFIG.REPO_NAME,
          });
          fork = existingFork;
          setSubmissionStatus(STATUS_MESSAGES.USING_EXISTING_FORK);
        } catch (error: any) {
          if (error.status === 404) {
            // No fork exists, create one
            setSubmissionStatus(STATUS_MESSAGES.CREATING_FORK);
            const { data: newFork } = await octokit.rest.repos.createFork({
              owner: GITHUB_CONFIG.REPO_OWNER,
              repo: GITHUB_CONFIG.REPO_NAME,
            });
            fork = newFork;

            // A delay to allow GitHub's API to process the fork creation.
            await new Promise((resolve) =>
              setTimeout(resolve, GITHUB_CONFIG.FORK_CREATION_DELAY),
            );

            // Verify the fork is accessible
            setSubmissionStatus(STATUS_MESSAGES.VERIFYING_FORK);
            try {
              await octokit.rest.repos.get({
                owner: userLogin,
                repo: GITHUB_CONFIG.REPO_NAME,
              });
            } catch (verifyError: any) {
              throw new Error(
                `${ERROR_MESSAGES.FORK_CREATION}: ${verifyError.message}`,
              );
            }
          } else {
            throw error;
          }
        }

        setSubmissionStatus(STATUS_MESSAGES.GETTING_COMMIT);
        // Get the latest commit from the fork, not the upstream repo
        const { data: forkBranch } = await octokit.rest.repos.getBranch({
          owner: userLogin,
          repo: GITHUB_CONFIG.REPO_NAME,
          branch: "main",
        });
        const latestForkSha = forkBranch.commit.sha;

        setSubmissionStatus(STATUS_MESSAGES.CREATING_BRANCH);
        const branchName = `add-${submission.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${Date.now()}`;

        try {
          // Create branch from the latest commit of the fork
          await octokit.rest.git.createRef({
            owner: userLogin,
            repo: GITHUB_CONFIG.REPO_NAME,
            ref: `refs/heads/${branchName}`,
            sha: latestForkSha,
          });
        } catch (branchError: any) {
          throw new Error(
            `${ERROR_MESSAGES.BRANCH_CREATION}: ${branchError.message}`,
          );
        }

        setSubmissionStatus(STATUS_MESSAGES.READING_README);
        // Get the README content from the original repository to ensure it's the latest version
        const { data: readmeData } = await octokit.rest.repos.getContent({
          owner: GITHUB_CONFIG.REPO_OWNER,
          repo: GITHUB_CONFIG.REPO_NAME,
          path: "README.md",
        });

        if (
          Array.isArray(readmeData) ||
          !("content" in readmeData) ||
          !readmeData.sha
        ) {
          throw new Error(ERROR_MESSAGES.README_FETCH);
        }
        const currentContent = Buffer.from(
          readmeData.content,
          "base64",
        ).toString();
        const latestReadmeSha = readmeData.sha;

        // Insert the new resource into the content
        const updatedContent = insertResourceIntoReadme(
          currentContent,
          submission,
        );

        setSubmissionStatus(STATUS_MESSAGES.COMMITTING);
        // Update README on the newly created branch using the upstream SHA
        await octokit.rest.repos.createOrUpdateFileContents({
          owner: userLogin,
          repo: GITHUB_CONFIG.REPO_NAME,
          path: "README.md",
          message: `feat: Add ${submission.name}`,
          content: Buffer.from(updatedContent).toString("base64"),
          sha: latestReadmeSha,
          branch: branchName,
        });

        setSubmissionStatus(STATUS_MESSAGES.CREATING_PR);

        // Generate PR body using template
        const prBody = generatePRBody(submission, userInfo.login);

        const { data: pr } = await octokit.rest.pulls.create({
          owner: GITHUB_CONFIG.REPO_OWNER,
          repo: GITHUB_CONFIG.REPO_NAME,
          title: `feat: Add ${submission.name}`,
          head: `${userLogin}:${branchName}`,
          base: "main",
          body: prBody,
        });

        return {
          success: true,
          prNumber: pr.number,
          prUrl: pr.html_url,
        };
      } catch (err: any) {
        const errorMessage = err.message || ERROR_MESSAGES.PR_CREATION;
        setError(errorMessage);
        return {
          success: false,
          error: errorMessage,
        };
      } finally {
        setIsSubmitting(false);
        setSubmissionStatus(null);
      }
    },

}
