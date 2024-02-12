document.getElementById("analyze").onclick = function() {
    let inputVal = document.getElementById("input").value.trim().toUpperCase();
    const fileInput = document.getElementById('fileInput').files[0];
    const resultElement = document.getElementById("output");
  
    if (inputVal !== '') {
        if (inputVal.startsWith('>')) {
            inputVal = inputVal.slice(1);
          // If the input starts with '>', combine substrings into one continuous sequence
          const sequences = inputVal.split('\n');
          const cleanedSequence = sequences.map(seq => seq.trim()).join('');
          processSequence(cleanedSequence,  resultElement);
          /* console.log("Sequence from manual entry:", cleanedSequence); // Logging the sequence */
        } else {
          // Treat it as a UniProt accession ID
          fetchUniProtSequence(inputVal)
            .then(sequence => {
              processSequence(sequence, resultElement);
             /*  console.log("Sequence from UniProt:", sequence); // Logging sequence from UniProt */
            })
            .catch(error => {
              resultElement.innerHTML = `Error: ${error.message}`;
            });
        }
      } else if (fileInput) {
        // If file uploaded, read its contents as sequence
        const reader = new FileReader();
        reader.onload = function(event) {
          const sequenceFromFile = event.target.result.replace(/\s/g, '').toUpperCase();
          processSequence(sequenceFromFile, "", resultElement);
          /* console.log("Sequence from File:", sequenceFromFile); // Logging sequence from file */
        };
        reader.onerror = function(event) {
          resultElement.innerHTML = "Error reading the file!";
        };
        reader.readAsText(fileInput);
      } else {
        resultElement.innerHTML = "Please provide a sequence or select a file!";
      }
    };


  function fetchUniProtSequence(accessionID) {
    const url = `https://rest.uniprot.org/uniprotkb/${accessionID}.fasta`;
    return fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch sequence from UniProt.');
        }
        return response.text(); // Read response as text
      })
      .then(data => {
        // Split data by lines, skip the first line (header), and join the rest to get the sequence
        const lines = data.split('\n');
        lines.shift(); // Remove the header
        const sequence = lines.join('').trim().toUpperCase(); // Extract and clean sequence
        if (sequence.length > 0) {
          return sequence;
        } else {
          throw new Error('No sequence found for this UniProt accession ID.');
        }
      });
  }
  
  
  function processSequence(data) {
    const protein = data.split('');
    const resultElement = document.getElementById("output");
      
  
    const mw = {
      'A': 71.0788, 'R': 156.1875, 'N': 114.1038, 'D': 115.0886, 'C': 103.1388,
      'E': 129.115, 'Q': 128.1307, 'G': 57.0519, 'H': 137.1411, 'I': 113.1594,
      'L': 113.1594, 'K': 128.1741, 'M': 131.1926, 'F': 147.1766, 'P': 97.1167,
      'S': 87.0782, 'T': 101.1051, 'W': 186.2132, 'Y': 163.1760, 'V': 99.1326
    };

    let add = 0;
    for (let base of protein) {
/*         if (mw[base] === undefined){
            console.log("Unknown AA: ${base}");
        } */
      add += mw[base];
    }

    // Adding the molecular weight of water below.
    const mwprotein = add + 18.01524; 

        const resultMessage = `The Molecular weight of Given Protein Sequence is:  ${mwprotein} kDa`;
    
    // Update the HTML element with the results
    resultElement.innerHTML = resultMessage;
} 

