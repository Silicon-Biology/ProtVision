// Function to handle file input change event
document.getElementById("fileInput").addEventListener("change", function(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    const resultElement = document.getElementById("output");
  
    reader.onload = function(event) {
      const sequenceFromFile = event.target.result.replace(/\s/g, '').toUpperCase();
      // Save the sequence from file to a variable
      window.fileSequence = sequenceFromFile;
    };
  
    reader.onerror = function(event) {
      resultElement.innerHTML = "Error reading the file!";
    };
  
    reader.readAsText(file);
  });
  
  // Function to handle "Analyze" button click
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
        processSequence(cleanedSequence, resultElement);
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
      // Process file sequence only when "Analyze" button is clicked
      if (window.fileSequence) {
        processSequence(window.fileSequence, resultElement);
      } else {
        resultElement.innerHTML = "Please select a file!";
      }
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
  
  function processSequence(data, resultElement) {
    // Sequence processing logic remains the same
    const data2 = data.toUpperCase();
    const protein = data2.split('');
    const aminoAcidCount = {};
  
    const sum = protein.length;

    const hydropathicityscale = {
      A: 1.8,
      R: -4.5,
      N: -3.5,
      D: -3.5,
      C: 2.5,
      E: -3.5,
      Q: -3.5,
      G: -0.4,
      H: -3.2,
      I: 4.5,
      L: 3.8,
      K: -3.9,
      M: 1.9,
      F: 2.8,
      P: -1.6,
      S: -0.8,
      T: -0.7,
      W: -0.9,
      Y: -1.3,
      V: 4.2,
    };
    
    let add = 0;
    for (let b = 0; b < protein.length; b++) {
      const base = protein[b];
      add += hydropathicityscale[base];
    }
    
    const hydropathyvalue = add; // total hydropathy value of protein
    const gravyvalue = hydropathyvalue / sum; // gravy value of protein 
    
    resultMessage = `The GRAVY value of Given Protein Sequence is: ${gravyvalue}`;
    
    // // Prepare and display the result message
    // let resultMessage = 'Amino Acid\tOccurrences\tPercentage\n';
    // for (let aminoAcid in aminoAcidCount) {
    //   resultMessage += `${aminoAcid}\t\t${aminoAcidCount[aminoAcid]}\t\t${percentages[aminoAcid].toFixed(4)}%\n`;
    // }
  
    // Update the HTML element with the results
    resultElement.innerHTML = resultMessage;
  }
  
  
    
    
   
  
  