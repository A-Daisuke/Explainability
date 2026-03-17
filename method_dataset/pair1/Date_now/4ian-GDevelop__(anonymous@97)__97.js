function __method_wrapper__() {
      {({ i18n }) => (
        <Dialog
          title={<Trans>Redeem a code</Trans>}
          actions={[
            <FlatButton
              label={<Trans>Close</Trans>}
              key="close"
              primary={false}
              disabled={isLoading}
              onClick={() => onClose(false)}
            />,
            <LeftLoader isLoading={isLoading} key="redeem">
              <DialogPrimaryButton
                label={<Trans>Redeem</Trans>}
                disabled={!canRedeem}
                primary
                onClick={onRedeemCode}
              />
            </LeftLoader>,
          ]}
          cannotBeDismissed={isLoading}
          onRequestClose={() => onClose(false)}
          onApply={() => {
            if (canRedeem) onRedeemCode();
          }}
          maxWidth="sm"
          open
        >
          <Form onSubmit={onRedeemCode} name="redeemSubscriptionCoupon">
            <ColumnStackLayout noMargin>
              <SemiControlledTextField
                value={redemptionCode}
                onChange={setRedemptionCode}
                translatableHintText={t`Enter your code here`}
                floatingLabelText={<Trans>Redemption code</Trans>}
                floatingLabelFixed
                errorText={getRedeemCodeErrorText(error)}
                autoFocus="desktop"
                disabled={isLoading}
              />
              {!subscription ||
              !subscription.planId ? null : !!subscription.redemptionCodeValidUntil ? ( // No subscription, do not show a warning.
                subscription.redemptionCodeValidUntil > Date.now() ? ( // Has valid subscription.
                  <AlertMessage kind="warning">
                    <Trans>
                      You currently have a subscription, applied thanks to a
                      redemption code, valid until{' '}
                      {i18n.date(subscription.redemptionCodeValidUntil)}. If you
                      redeem another code, your existing subscription will be
                      canceled and not redeemable anymore!
                    </Trans>
                  </AlertMessage>
                ) : null // Has expired subscription, do not show a warning.
              ) : (
                // Has a subscription, but not applied thanks to a redemption code.
                <AlertMessage kind="info">
                  <Trans>
                    You currently have a subscription. If you redeem a code, the
                    existing subscription will be cancelled and replaced by the
                    one given by the code.
                  </Trans>
                </AlertMessage>
              )}
            </ColumnStackLayout>
          </Form>
        </Dialog>
      )}

}
