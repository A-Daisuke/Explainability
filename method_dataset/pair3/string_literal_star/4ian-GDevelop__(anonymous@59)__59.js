function __method_wrapper__() {
      {({ i18n }) => (
        <div
          style={{
            ...styles.chip,
            backgroundColor: getStatusColor(
              gdevelopTheme,
              openedVersionStatus.status
            ),
          }}
        >
          <Text noMargin color="inherit">
            {openedVersionStatus.status === 'saving'
              ? i18n._(t`Saving...`)
              : (openedVersionStatus.version.label
                  ? shortenString(openedVersionStatus.version.label, 20)
                  : i18n.date(
                      Date.parse(openedVersionStatus.version.createdAt),
                      {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      }
                    )) +
                (openedVersionStatus.status === 'unsavedChanges' ? '*' : '')}
          </Text>
          <Spacer />
          <ButtonBase
            classes={classes}
            onClick={onQuit}
            disabled={disableQuitting}
          >
            <Cross />
          </ButtonBase>
        </div>
      )}

}
