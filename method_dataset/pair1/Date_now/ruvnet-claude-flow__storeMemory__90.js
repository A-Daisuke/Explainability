async function storeMemory(subArgs, loadMemory, saveMemory, namespace, enableRedaction = false) {
  const key = subArgs[1];
  let value = subArgs.slice(2).join(' ');

  if (!key || !value) {
    printError('Usage: memory store <key> <value> [--namespace <ns>] [--redact]');
    return;
  }

  try {
    // Apply redaction if enabled
    let redactedValue = value;
    let securityWarnings = [];

    if (enableRedaction) {
      redactedValue = KeyRedactor.redact(value, true);
      const validation = KeyRedactor.validate(value);

      if (!validation.safe) {
        securityWarnings = validation.warnings;
        printWarning('🔒 Redaction enabled: Sensitive data detected and redacted');
        securityWarnings.forEach(warning => console.log(`   ⚠️  ${warning}`));
      }
    } else {
      // Even if redaction is not explicitly enabled, validate and warn
      const validation = KeyRedactor.validate(value);
      if (!validation.safe) {
        printWarning('⚠️  Potential sensitive data detected! Use --redact flag for automatic redaction');
        validation.warnings.forEach(warning => console.log(`   ⚠️  ${warning}`));
        console.log('   💡 Tip: Add --redact flag to automatically redact API keys');
      }
    }

    const data = await loadMemory();

    if (!data[namespace]) {
      data[namespace] = [];
    }

    // Remove existing entry with same key
    data[namespace] = data[namespace].filter((e) => e.key !== key);

    // Add new entry with redacted value
    data[namespace].push({
      key,
      value: redactedValue,
      namespace,
      timestamp: Date.now(),
      redacted: enableRedaction && securityWarnings.length > 0,
    });

    await saveMemory(data);
    printSuccess(enableRedaction && securityWarnings.length > 0 ? '🔒 Stored successfully (with redaction)' : '✅ Stored successfully');
    console.log(`📝 Key: ${key}`);
    console.log(`📦 Namespace: ${namespace}`);
    console.log(`💾 Size: ${new TextEncoder().encode(redactedValue).length} bytes`);
    if (enableRedaction && securityWarnings.length > 0) {
      console.log(`🔒 Security: ${securityWarnings.length} sensitive pattern(s) redacted`);
    }
  } catch (err) {
    printError(`Failed to store: ${err.message}`);
  }
}
