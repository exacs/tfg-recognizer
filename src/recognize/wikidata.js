import fetch from 'isomorphic-fetch';
/**
 * Recognize a string as a Wikidata entity performing a simple search.
 *
 * Parameters:
 * - String `text`. The string to look for in Wikidata
 * - (optional) Object `link`. An object targeting `text`. It has the
 *   information to reference the original source of the text.
 *
 * Returns a Promise that resolves in a list of `concept` objects, where each
 * `concept` has the following fields:
 * - String `uri`. The Wikidata URI of the concept
 * - String `label`. The name of the concept according to Wikidata
 * - String `description`. The description of the concept according to Wikidata
 */

export default function wikidataRecognize(text /*, link */) {
  const url =
    `https://www.wikidata.org/w/api.php` +
    `?action=wbsearchentities&search=${text}&language=en&props=&format=json`;

  return fetch(url)
    .then(r => r.json())
    .then(r =>
      r.search.map(entry => ({
        uri: entry.concepturi,
        label: entry.label,
        description: entry.description
      }))
    );
}
