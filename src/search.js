import { Parser, Generator } from "sparqljs";
export const search = async (input) => {
  const query = `
    PREFIX : <http://www.semanticweb.org/ontologies/2015/1/EPNet-ONTOP_Ontology#>
    PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX dcterms: <http://purl.org/dc/terms/>
    PREFIX pleiades: <http://pleiades.stoa.org/places/>
    PREFIX edh: <http://edh-www.adw.uni-heidelberg.de/edh/inschrift/>
    PREFIX ads: <http://data.archaeologydataservice.ac.uk/romanamphorae/>
    PREFIX fabio: <http://purl.org/spar/fabio/>
    PREFIX co: <http://purl.org/co/>
    PREFIX shape: <http://www.semanticweb.org/ontologies/2015/1/EPNet-ONTOP_Ontology#shape/>
    PREFIX relief: <http://www.semanticweb.org/ontologies/2015/1/EPNet-ONTOP_Ontology#relief/>
    PREFIX placefunc: <http://www.semanticweb.org/ontologies/2015/1/EPNet-ONTOP_Ontology#placefunc/>
    PREFIX readir: <http://www.semanticweb.org/ontologies/2015/1/EPNet-ONTOP_Ontology#readir/>
    PREFIX amphsect: <http://www.semanticweb.org/ontologies/2015/1/EPNet-ONTOP_Ontology#amphsect/>
    PREFIX ink: <http://www.semanticweb.org/ontologies/2015/1/EPNet-ONTOP_Ontology#ink/>
    PREFIX coctura: <http://www.semanticweb.org/ontologies/2015/1/EPNet-ONTOP_Ontology#coctura/>
    PREFIX graffito: <http://www.semanticweb.org/ontologies/2015/1/EPNet-ONTOP_Ontology#sketch/>
    SELECT ?ceipacNumber ?transcription ?findingPlace ?findingSpot ?country ?url
    WHERE {
        ?amph a :Amphora .
        ?amph dcterms:identifier ?ceipacNumber .
        ?amph :carries ?inscription .
        ?inscription :isDocumentedBy ?image .   
        ?image fabio:hasURL ?url .
        ?inscription :isTranscribedBy ?linguisticObject .
        ?linguisticObject :hasFullTranscription ?transcription .
        ?amph :hasFindingPlace ?findplace .
        ?findplace :fallsWithin ?cou .
        ?cou a :Country .
        ?cou dcterms:title ?country .
        FILTER (regex(str(?transcription), "(?i)${input}"))
        ?findplace :fallsWithin ?mun .
        ?mun a :Municipality .
        ?mun dcterms:title ?findingPlace .
        optional {
            ?findplace :fallsWithin ?msp .
            ?msp a :ModernSpot .
            ?msp dcterms:title ?findingSpot .
        }
    }
    ORDER BY ?findingPlace ?findingSpot
    LIMIT 100`;
  const parser = new Parser();
  const generator = new Generator();

  const sparqlQuery = generator.stringify(parser.parse(query));
  const res = await fetch(
    `https://romanopendata.eu/sparql-endpoint?query=${encodeURIComponent(
      sparqlQuery
    )}`
  );
  const text = await res.text();

  const data = [];

  const xml = new DOMParser().parseFromString(text, "text/xml");
  console.log(xml);
  const results = [...xml.getElementsByTagName("result")];
  console.log(results.length);

  results.forEach((result) => {
    const bindings = [...result.getElementsByTagName("binding")];
    const resultObj = {};
    bindings.forEach((binding) => {
      const elementName = binding
        .getAttribute("name")
        .replace(/[^\x00-\x7F]/g, "");
      const elementValue =
        binding.getElementsByTagName("literal")[0].firstChild.data;
      resultObj[elementName] = elementValue;
    });
    data.push(resultObj);
  });
  return data;
};
