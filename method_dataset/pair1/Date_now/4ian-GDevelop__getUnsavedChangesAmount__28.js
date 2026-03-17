export const getUnsavedChangesAmount = (
  unsavedChanges: UnsavedChanges
): UnsavedChangesAmount => {
  const { getChangesCount, getTimeOfFirstChangeSinceLastSave } = unsavedChanges;
  const changesCount = getChangesCount();
  const timeOfFirstChangeSinceLastSave = getTimeOfFirstChangeSinceLastSave();

  if (changesCount === 0 || !timeOfFirstChangeSinceLastSave) return 'none';
  const now = Date.now();
  if (changesCount > MINIMUM_CHANGES_FOR_RISKY_STATUS) return 'risky';
  if (now - timeOfFirstChangeSinceLastSave > MINIMUM_DURATION_FOR_RISKY_STATUS)
    return 'risky';
  else if (
    now - timeOfFirstChangeSinceLastSave <
    MAXIMUM_DURATION_FOR_SMALL_STATUS
  )
    return 'small';
  else {
    // Between MAXIMUM_DURATION_FOR_SMALL_STATUS and MINIMUM_DURATION_FOR_RISKY_STATUS without saving.
    if (changesCount <= MINIMUM_CHANGES_FOR_SIGNIFICANT_STATUS) return 'small';
    if (changesCount <= MINIMUM_CHANGES_FOR_RISKY_STATUS) return 'significant';
    return 'risky';
  }
};
