export async function callAction(request: Request, id: string | null | undefined): Promise<{result: any}> {
  (request as any)[temporaryReferencesSymbol] ??= createTemporaryReferenceSet();

  if (id) {
    let action = await loadServerAction(id);
    let body = request.headers.get('content-type')?.includes('multipart/form-data') 
      ? await request.formData()
      : await request.text();
    let args = await decodeReply<any[]>(body, {
      temporaryReferences: (request as any)[temporaryReferencesSymbol]
    });

    let result = action.apply(null, args);
    try {
      // Wait for any mutations
      await result;
    } catch {
      // Handle the error on the client
    }
    return {result};
  } else {
    // Form submitted by browser (progressive enhancement).
    let formData = await request.formData();
    let action = await decodeAction(formData);
    // Don't catch error here: this should be handled by the caller (e.g. render an error page).
    let result = await action();
    return {result};
  }
}
