const transformDefs = (data) => {
const { meanings } = data[0];
let id = 0;
  return meanings.map((meaning) => {
    id = id + 1;
    
    return {
      partOfSpeech: meaning.partOfSpeech,
      definition: meaning.definitions[0].definition,
      example: meaning.definitions[0].example,
      id
    }
  });
};

export { transformDefs }