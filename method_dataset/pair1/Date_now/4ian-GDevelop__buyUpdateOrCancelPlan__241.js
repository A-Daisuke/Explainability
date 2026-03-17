  const buyUpdateOrCancelPlan = async (
    i18n: I18nType,
    subscriptionPlanPricingSystem: SubscriptionPlanPricingSystem | null
  ) => {
    const { getAuthorizationHeader, subscription, profile } = authenticatedUser;
    if (!profile || !subscription) return;
    if (subscriptionPlanPricingSystem) {
      sendChoosePlanClicked({
        planId: subscriptionPlanPricingSystem.planId,
        pricingSystemId: subscriptionPlanPricingSystem.id,
      });
    }
    // Subscribing from an account without a subscription
    if (!subscription.planId && subscriptionPlanPricingSystem) {
      onOpenPendingDialog(true);
      const isEducationPlan =
        subscriptionPlanPricingSystem &&
        subscriptionPlanPricingSystem.planId === 'gdevelop_education';
      const quantity = isEducationPlan ? educationPlanSeatsCount : undefined;
      Window.openExternalURL(
        getRedirectToCheckoutUrl({
          pricingSystemId: subscriptionPlanPricingSystem.id,
          userId: profile.id,
          userEmail: profile.email,
          quantity,
        })
      );
      return;
    }

    if (!subscriptionPlanPricingSystem) {
      // Cancelling the existing subscription.
      const answer = await showConfirmation(cancelConfirmationTexts);
      if (!answer) return;

      setCancelReasonDialogOpen(true);
      return;
    }

    const { planId } = subscriptionPlanPricingSystem;
    const needToCancelSubscription = !canSeamlesslyChangeSubscription(
      subscription,
      planId
    );
    const hasValidRedeemedSubscription =
      !!subscription.redemptionCodeValidUntil &&
      subscription.redemptionCodeValidUntil > Date.now();
    const hasExpiredRedeemedSubscription =
      !!subscription.redemptionCodeValidUntil &&
      subscription.redemptionCodeValidUntil < Date.now();
    const shouldSkipAlert = hasExpiredRedeemedSubscription; // we don't show an alert if the redeemed code is expired

    // Changing the existing subscription.
    const confirmDialogTexts =
      !needToCancelSubscription || hasExpiredRedeemedSubscription
        ? seamlesslyChangeConfirmationTexts
        : hasValidRedeemedSubscription
        ? cancelAndChangeWithValidRedeemedCodeConfirmationTexts
        : cancelAndChangeConfirmationTexts;

    if (!shouldSkipAlert) {
      const answer = await showConfirmation(confirmDialogTexts);
      if (!answer) return;
    }

    if (!needToCancelSubscription) {
      // Changing the existing subscription without asking for payment details again.
      // TODO: When possible, handle cases when a subscription can be updated seamlessly.
    } else {
      // Changing the existing subscription by cancelling first.
      setIsChangingSubscription(true);
      await sendCancelSubscriptionToChange({
        planId: subscriptionPlanPricingSystem.planId,
        pricingSystemId: subscriptionPlanPricingSystem.id,
      });
      try {
        await changeUserSubscription(
          getAuthorizationHeader,
          profile.id,
          {
            planId: null,
          },
          {
            cancelImmediately: true,
            cancelReasons: {
              'changing-subscription': true,
            },
          }
        );
        await authenticatedUser.onRefreshSubscription();
      } catch (rawError) {
        showErrorBox({
          message: i18n._(
            t`Your subscription could not be cancelled. Please try again later!`
          ),
          rawError,
          errorId: 'subscription-update-error',
        });
      } finally {
        setIsChangingSubscription(false);
      }

      // Then redirect as if a new subscription is being chosen.
      onOpenPendingDialog(true);
      Window.openExternalURL(
        getRedirectToCheckoutUrl({
          pricingSystemId: subscriptionPlanPricingSystem.id,
          userId: profile.id,
          userEmail: profile.email,
        })
      );
    }
  };
