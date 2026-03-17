export const prepareAiUserContent = async ({
  getAuthorizationHeader,
  userId,
  simplifiedProjectJson,
  projectSpecificExtensionsSummaryJson,
}: {|
  getAuthorizationHeader: () => Promise<string>,
  userId: string,
  simplifiedProjectJson: string | null,
  projectSpecificExtensionsSummaryJson: string | null,
|}) => {
  // Hash the contents, if provided, to then upload it only once (as long as the hash stays
  // the same, no need to re-upload it for a while).
  // If the content is not provided, no hash is computed because there is no content to upload.
  const startTime = Date.now();
  const gameProjectJsonHash = simplifiedProjectJson
    ? computeSha256(simplifiedProjectJson)
    : null;
  const projectSpecificExtensionsSummaryJsonHash = projectSpecificExtensionsSummaryJson
    ? computeSha256(projectSpecificExtensionsSummaryJson)
    : null;
  const endTime = Date.now();
  console.info(
    `Hash of simplified project json and project specific extensions summary json took ${(
      endTime - startTime
    ).toFixed(2)}ms`
  );

  const shouldUploadProjectSpecificExtensionsSummary = projectSpecificExtensionsSummaryUploadCache.shouldUpload(
    {
      hash: projectSpecificExtensionsSummaryJsonHash,
      contentLength: projectSpecificExtensionsSummaryJson
        ? projectSpecificExtensionsSummaryJson.length
        : 0,
    }
  );

  const shouldUploadGameProjectJson = gameProjectJsonUploadCache.shouldUpload({
    hash: gameProjectJsonHash,
    contentLength: simplifiedProjectJson ? simplifiedProjectJson.length : 0,
  });

  if (
    shouldUploadGameProjectJson ||
    shouldUploadProjectSpecificExtensionsSummary
  ) {
    const startTime = Date.now();
    const {
      gameProjectJsonSignedUrl,
      gameProjectJsonUserRelativeKey,
      projectSpecificExtensionsSummaryJsonSignedUrl,
      projectSpecificExtensionsSummaryJsonUserRelativeKey,
    }: AiUserContentPresignedUrlsResult = await retryIfFailed(
      { times: 3 },
      () =>
        createAiUserContentPresignedUrls(getAuthorizationHeader, {
          userId,
          gameProjectJsonHash: shouldUploadGameProjectJson
            ? gameProjectJsonHash
            : null,
          projectSpecificExtensionsSummaryJsonHash: shouldUploadProjectSpecificExtensionsSummary
            ? projectSpecificExtensionsSummaryJsonHash
            : null,
        })
    );

    const uploadedAt = Date.now();

    await Promise.all([
      gameProjectJsonSignedUrl
        ? retryIfFailed({ times: 3 }, () =>
            axios.put(gameProjectJsonSignedUrl, simplifiedProjectJson, {
              headers: {
                'Content-Type': 'application/json',
              },
              // Allow any arbitrary large file to be sent
              maxContentLength: Infinity,
            })
          ).then(() => {
            gameProjectJsonUploadCache.storeUpload(gameProjectJsonHash, {
              uploadedAt,
              userRelativeKey: gameProjectJsonUserRelativeKey || null,
            });
          })
        : null,
      projectSpecificExtensionsSummaryJsonSignedUrl
        ? retryIfFailed({ times: 3 }, () =>
            axios.put(
              projectSpecificExtensionsSummaryJsonSignedUrl,
              projectSpecificExtensionsSummaryJson,
              {
                headers: {
                  'Content-Type': 'application/json',
                },
                // Allow any arbitrary large file to be sent
                maxContentLength: Infinity,
              }
            )
          ).then(() => {
            projectSpecificExtensionsSummaryUploadCache.storeUpload(
              projectSpecificExtensionsSummaryJsonHash,
              {
                uploadedAt,
                userRelativeKey:
                  projectSpecificExtensionsSummaryJsonUserRelativeKey || null,
              }
            );
          })
        : null,
    ]);

    const endTime = Date.now();
    console.info(
      `Upload of ${[
        shouldUploadGameProjectJson ? 'simplified project' : null,
        shouldUploadProjectSpecificExtensionsSummary
          ? 'project specific extensions summary'
          : null,
      ]
        .filter(Boolean)
        .join(' and ')} took ${(endTime - startTime).toFixed(2)}ms`
    );
  }

  // Get the key at which the content was uploaded, if it was uploaded.
  // If not, the content will be sent as part of the request instead of the upload key.
  const gameProjectJsonUserRelativeKey = gameProjectJsonUploadCache.getUserRelativeKey(
    gameProjectJsonHash
  );
  const projectSpecificExtensionsSummaryJsonUserRelativeKey = projectSpecificExtensionsSummaryUploadCache.getUserRelativeKey(
    projectSpecificExtensionsSummaryJsonHash
  );

  return {
    gameProjectJsonUserRelativeKey,
    gameProjectJson: gameProjectJsonUserRelativeKey
      ? null
      : simplifiedProjectJson,
    projectSpecificExtensionsSummaryJsonUserRelativeKey,
    projectSpecificExtensionsSummaryJson: projectSpecificExtensionsSummaryJsonUserRelativeKey
      ? null
      : projectSpecificExtensionsSummaryJson,
  };
};
