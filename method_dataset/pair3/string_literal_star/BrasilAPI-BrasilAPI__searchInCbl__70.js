export default async function searchInCbl(isbn) {
  const isbn13 = isbn.length === 10 ? convertIsbn10ToIsbn13(isbn) : isbn;
  const isbn10 = isbn.length === 13 ? convertIsbn13ToIsbn10(isbn) : isbn;

  // Try to mimic the CBL website request.
  const searchPayload = {
    count: true,
    facets: ['Imprint,count:50', 'Authors,count:50'],
    filter: '',
    orderby: null,
    queryType: 'full',
    search: `${isbn13} OR ${isbn10}`,
    searchFields: 'FormattedKey,RowKey',
    searchMode: 'any',
    select: '*',
    skip: 0,
    top: 12,
  };

  const response = await axios.post(API_SEARCH_URL, searchPayload, {
    headers: {
      Accept: 'application/json',
      'Api-Key': API_KEY,
    },
  });

  if (!response.data.value || !response.data.value[0]) {
    throw new NotFoundError({ message: 'ISBN não encontrado' });
  }

  const cblBook = response.data.value[0];

  return {
    isbn: cblBook.RowKey,
    title: cblBook.Title,
    subtitle: cblBook.Subtitle,
    authors: cblBook.Authors,
    publisher: cblBook.Imprint,
    synopsis: cblBook.Sinopse,
    dimensions: parseDimensions(cblBook.Dimensao),
    year: cblBook.Ano ? parseInt(cblBook.Ano, 10) : null,
    format: cblBook.Formato === 'Papel' ? 'PHYSICAL' : 'DIGITAL',
    page_count: cblBook.Paginas ? parseInt(cblBook.Paginas, 10) : null,
    subjects: [cblBook.Subject]
      .concat(cblBook.PalavrasChave || [])
      .filter(Boolean),
    location: parseLocation(cblBook.Cidade, cblBook.UF),
    retail_price: null,
    cover_url: null,
    provider: 'cbl',
  };
}
