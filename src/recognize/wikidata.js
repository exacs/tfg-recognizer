import path from 'path';
import fetch from 'isomorphic-fetch';
/**
 * Recognize a string as a Wikidata entity performing a simple search.
 *
 * Parameters:
 * - String `text`. The string to look for in Wikidata
 * - (optional) Object `link`. An object targeting `text`. It has the
 *   information to reference the original source of the text.
 * - (optional) Object `context`. An object with the property `type`. If
 *   specified, the function filters the list of `concept` objects returning
 *   only the objects which type matches.
 *
 *   `type` can have the following values: `place`
 *
 * Returns a Promise that resolves in a list of `concept` objects, where each
 * `concept` has the following fields:
 * - String `uri`. The Wikidata URI of the concept
 * - String `label`. The name of the concept according to Wikidata
 * - String `description`. The description of the concept according to Wikidata
 */
export default function wikidataRecognize(text, link, {type}) {
  const searchResults = search(text);

  if (type === 'place') {
    return searchResults
      .then(entries => Promise.all(entries.map(isPlace)))
      .then(entries => entries.filter(e => e.isPlace));
  } else {
    return searchResults;
  }
}

function search(text) {
  const url =
    `https://www.wikidata.org/w/api.php` +
    `?action=wbsearchentities&search=${text}&language=en&props=&format=json`;

  return fetch(url)
    .then(r => r.json())
    .then(r =>
      r.search.map(entry => ({
        id: entry.id,
        uri: entry.concepturi,
        label: entry.label,
        description: entry.description
      }))
    );
}

function isPlace(entry) {
  const concept = path.parse(entry.uri).name;
  console.log(concept);

  const endpointUrl = 'https://query.wikidata.org/sparql';
  const sparqlQuery =  `SELECT DISTINCT ?type WHERE {
  wd:${concept} wdt:P31/wdt:P279* ?type.
  FILTER(?type = wd:Q618123).
} LIMIT 1`;

  const fullUrl = endpointUrl + '?query=' + encodeURIComponent(sparqlQuery);
  const headers = { 'Accept': 'application/sparql-results+json' };

  return fetch(fullUrl, {headers})
    .then(body => body.json())
    .then(json => ({
      id: entry.id,
      uri: entry.uri,
      label: entry.label,
      description: entry.description,
      isPlace: json.results.bindings.length > 0
    }));
}
