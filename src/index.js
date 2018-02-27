/**
 * Entry point of the Entity Recognizer API
 */
import wikidataRecognize from './recognize/wikidata';
import psqlInsert from './insert/psql';

export {
  wikidataRecognize,
  psqlInsert
};
