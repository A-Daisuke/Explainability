const SubscriptionDetails = ({
  subscription,
  subscriptionPlansWithPricingSystems,
  isManageSubscriptionLoading,
  onManageSubscription,
  simulateNativeMobileApp,
}: Props) => {
  const { openSubscriptionDialog } = React.useContext(
    SubscriptionSuggestionContext
  );
  const { showAlert } = useAlertDialog();
  const gdevelopTheme = React.useContext(GDevelopThemeContext);
  const [
    userSubscriptionPlanWithPricingSystems,
    setUserSubscriptionPlanWithPricingSystems,
  ] = React.useState<?SubscriptionPlanWithPricingSystems>(null);
  const [error, setError] = React.useState<?React.Node>(null);
  const [isLoadingUserPrice, setIsLoadingUserPrice] = React.useState<boolean>(
    false
  );

  React.useEffect(
    () => {
      (async () => {
        setError(null);
        setIsLoadingUserPrice(true);
        try {
          if (!subscription || !subscriptionPlansWithPricingSystems) {
            setUserSubscriptionPlanWithPricingSystems(null);
            return;
          }

          const { planId, pricingSystemId } = subscription;
          if (!planId || !pricingSystemId) {
            setUserSubscriptionPlanWithPricingSystems(null);
            return;
          }

          const matchingSubscriptionPlanWithPrices = subscriptionPlansWithPricingSystems.find(
            plan => subscription.planId === plan.id
          );
          if (!matchingSubscriptionPlanWithPrices) {
            setError(
              <Trans>
                Couldn't find a subscription matching your account. Please get
                in touch with us to fix this issue.
              </Trans>
            );
            setUserSubscriptionPlanWithPricingSystems(null);
            return;
          }

          const {
            pricingSystems,
            ...subscriptionPlan
          } = matchingSubscriptionPlanWithPrices;

          if (!canPriceBeFoundInGDevelopPrices(pricingSystemId)) {
            setUserSubscriptionPlanWithPricingSystems({
              ...subscriptionPlan,
              pricingSystems: [],
            });
            return;
          }

          let pricingSystem = pricingSystems.find(
            price => price.id === subscription.pricingSystemId
          );
          if (!pricingSystem) {
            pricingSystem = await getSubscriptionPlanPricingSystem(
              pricingSystemId
            );
          }
          if (!pricingSystem) {
            setError(
              <Trans>
                Couldn't find a subscription price matching your account. Please
                get in touch with us to fix this issue.
              </Trans>
            );
            setUserSubscriptionPlanWithPricingSystems(null);
            return;
          }

          setUserSubscriptionPlanWithPricingSystems({
            ...subscriptionPlan,
            pricingSystems: [pricingSystem],
          });
        } finally {
          setIsLoadingUserPrice(false);
        }
      })();
    },
    [subscription, subscriptionPlansWithPricingSystems]
  );

  const redemptionCodeExpirationDate =
    subscription && subscription.redemptionCodeValidUntil;
  const isSubscriptionExpired =
    !!redemptionCodeExpirationDate && redemptionCodeExpirationDate < Date.now();
  const isOnOrSimulateMobileApp =
    isNativeMobileApp() || simulateNativeMobileApp;

  const header = (
    <Line alignItems="center">
      <Column noMargin>
        <Text size="block-title">
          <Trans>Subscriptions</Trans>
        </Text>
        <Text size="body" noMargin>
          <Trans>
            Publish to Android, iOS, unlock more cloud projects, leaderboards,
            collaboration features and more online services.{' '}
            <Link
              href="https://gdevelop.io/pricing#feature-comparison"
              onClick={() =>
                Window.openExternalURL(
                  'https://gdevelop.io/pricing#feature-comparison'
                )
              }
            >
              Learn more
            </Link>
          </Trans>
        </Text>
      </Column>
    </Line>
  );

  if (error) {
    return (
      <Column noMargin>
        {header}
        <PlaceholderError>{error}</PlaceholderError>
      </Column>
    );
  }
  if (
    !subscription ||
    !subscriptionPlansWithPricingSystems ||
    isLoadingUserPrice
  ) {
    return (
      <Column noMargin>
        {header}
        <PlaceholderLoader style={{ minHeight: 205 }} />
      </Column>
    );
  }

  return (
    <Column noMargin>
      {header}
      {userSubscriptionPlanWithPricingSystems &&
      userSubscriptionPlanWithPricingSystems.id &&
      !isSubscriptionExpired ? (
        isOnOrSimulateMobileApp ? (
          <Paper background="medium" variant="outlined" style={styles.paper}>
            <ResponsiveLineStackLayout
              alignItems="center"
              expand
              noMargin
              noResponsiveLandscape
            >
              <Column expand noMargin>
                <LineStackLayout alignItems="center">
                  <img
                    src="res/diamond.svg"
                    style={styles.diamondIcon}
                    alt="diamond"
                  />
                  <Text noMargin>
                    <Trans>
                      You have unlocked full access to GDevelop to create
                      without limits!
                    </Trans>
                  </Text>
                </LineStackLayout>
              </Column>
              <Column noMargin>
                <RaisedButton
                  label={<Trans>Manage subscription</Trans>}
                  primary
                  onClick={() => {
                    if (hasMobileAppStoreSubscriptionPlan(subscription)) {
                      // Would open App Store subscriptions settings.
                    } else {
                      showAlert({
                        title: t`Subscription outside the app store`,
                        message: t`The subscription of this account comes from outside the app store. Connect with your account on gdevelop.io from your web-browser to manage it.`,
                      });
                    }
                  }}
                />
              </Column>
            </ResponsiveLineStackLayout>
          </Paper>
        ) : (
          // On web/desktop, displays the subscription as usual:
          <ColumnStackLayout noMargin>
            <PlanSmallCard
              subscriptionPlanWithPricingSystems={
                userSubscriptionPlanWithPricingSystems
              }
              hidePrice={
                // A redemption code means the price does not really reflect what was paid, so we hide it.
                !!redemptionCodeExpirationDate ||
                hasMobileAppStoreSubscriptionPlan(subscription)
              }
              actions={[
                !redemptionCodeExpirationDate &&
                !hasMobileAppStoreSubscriptionPlan(subscription) &&
                !isSubscriptionComingFromTeam(subscription) &&
                !hasSubscriptionBeenManuallyAdded(subscription) ? (
                  <FlatButton
                    key="manage-payments"
                    label={
                      <LeftLoader isLoading={isManageSubscriptionLoading}>
                        <Trans>Manage payments</Trans>
                      </LeftLoader>
                    }
                    primary
                    onClick={onManageSubscription}
                    disabled={isManageSubscriptionLoading}
                  />
                ) : null,
                !isSubscriptionComingFromTeam(subscription) ? (
                  <RaisedButton
                    key="manage-subscription"
                    label={<Trans>Manage subscription</Trans>}
                    primary
                    onClick={() => {
                      openSubscriptionDialog({
                        analyticsMetadata: {
                          reason: 'Consult profile',
                          placementId: 'profile',
                        },
                      });
                    }}
                    disabled={isManageSubscriptionLoading}
                  />
                ) : null,
              ].filter(Boolean)}
              isHighlighted
              background="medium"
            />
            {subscription.cancelAtPeriodEnd && (
              <AlertMessage kind="warning">
                <Trans>
                  Your subscription is being cancelled: you will lose the
                  benefits at the end of the period you already paid for.
                </Trans>
              </AlertMessage>
            )}
            {!!redemptionCodeExpirationDate && (
              <I18n>
                {({ i18n }) => (
                  <Paper background="dark" variant="outlined">
                    <LineStackLayout alignItems="center" noMargin>
                      <img
                        src="res/diamond.svg"
                        style={styles.diamondIcon}
                        alt="diamond"
                      />
                      <Column>
                        <Text>
                          <Trans>
                            Thanks to the redemption code you've used, you have
                            this subscription enabled until{' '}
                            {i18n.date(subscription.redemptionCodeValidUntil)}.
                          </Trans>
                        </Text>
                      </Column>
                    </LineStackLayout>
                  </Paper>
                )}
              </I18n>
            )}
          </ColumnStackLayout>
        )
      ) : !isSubscriptionExpired ? (
        isOnOrSimulateMobileApp ? (
          <GetSubscriptionCard
            label={<Trans>Choose a subscription</Trans>}
            subscriptionDialogOpeningReason="Consult profile"
            placementId="profile"
          >
            <Text noMargin>
              <Trans>
                Unlock full access to GDevelop to create without limits!
              </Trans>
            </Text>
          </GetSubscriptionCard>
        ) : (
          <ResponsiveLineStackLayout noColumnMargin noResponsiveLandscape>
            {Object.keys(subscriptionOptions).map(key => {
              const {
                title,
                description,
                icon,
                buttonColor,
              } = subscriptionOptions[key];
              return (
                <div
                  style={{
                    ...styles.subscription,
                    border: `1px solid ${gdevelopTheme.palette.secondary}`,
                  }}
                  key={key}
                >
                  <Column
                    expand
                    alignItems="center"
                    justifyContent="space-between"
                    noMargin
                    key={key}
                  >
                    {icon}
                    <Column noMargin alignItems="center" expand>
                      <Text size="sub-title" noMargin align="center">
                        {title}
                      </Text>
                      <Text
                        size="body-small"
                        noMargin
                        color="secondary"
                        align="center"
                      >
                        {description}
                      </Text>
                    </Column>
                    <Spacer />
                    <RaisedButton
                      color={buttonColor}
                      onClick={() =>
                        openSubscriptionDialog({
                          analyticsMetadata: {
                            reason: 'Consult profile',
                            placementId: 'profile',
                          },
                          filter: key,
                        })
                      }
                      label={<Trans>See plans</Trans>}
                      fullWidth
                    />
                  </Column>
                </div>
              );
            })}
          </ResponsiveLineStackLayout>
        )
      ) : (
        <GetSubscriptionCard
          label={<Trans>Choose a subscription</Trans>}
          subscriptionDialogOpeningReason="Consult profile"
          recommendedPlanIdIfNoSubscription="gdevelop_silver"
          placementId="profile"
        >
          <Text noMargin>
            <Trans>
              Oh no! Your subscription from the redemption code has expired. You
              can renew it by redeeming a new code or getting a new
              subscription.
            </Trans>
          </Text>
        </GetSubscriptionCard>
      )}
    </Column>
  );
};
