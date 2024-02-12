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
    const totalLength = protein.length;
   
    const halflifeM = {
        "A": "4.4 hour", "R": "1 hour", "N": "1.4 hour", "D": "1.1 hour", "C": "1.1 hour",
        "Q": "0.8 hour", "E": "1 hour", "G": "30 hour", "H": "3.5 hour", "I": "20 hour",
        "L": "5.5 hour", "K": "1.3 hour", "M": "30 hour", "F": "1.1 hour", "P": ">20 hour",
        "S": "1.9 hour", "T": "7.2 hour", "W": "2.8 hour", "Y": "2.8 hour", "V": "100 hour"
      };
      
      const halflifeY = {
        "A": ">20 hour", "R": "2 min", "N": "3 min", "D": "3 min", "C": ">20 hour",
        "Q": "10 min", "E": "30 min", "G": ">20 hour", "H": "10 min", "I": "30 min",
        "L": "3 min", "K": "3 min", "M": ">20 hour", "F": "3 min", "P": ">20 hour",
        "S": ">20 hour", "T": ">20 hour", "W": "3 min", "Y": "10 min", "V": ">20 hour"
      };
      
      const halflifeE = {
        "A": ">10 hour", "R": "2 min", "N": ">10 hour", "D": ">10 hour", "C": ">10 hour",
        "Q": ">10 hour", "E": ">10 hour", "G": ">10 hour", "H": ">10 hour", "I": ">10 hour",
        "L": "2 min", "K": "2 min", "M": ">10 hour", "F": "2 min", "P": "...", "S": ">10 hour",
        "T": ">10 hour", "W": "2 min", "Y": "2 min", "V": ">10 hour"
      };
    
    // Prepare and display the result message
    let resultMessage = 'Estimated Half Life of Protein in Mammal = ' + `${halflifeM[protein[0]]}` + '\n'+ 'Estimated Half Life of Protein in Yeast = ' + `${halflifeY[protein[0]]}` + '\n' + 'Estimated Half Life of Protein in E.Coli = ' + `${halflifeE[protein[0]]}` + '\n ';
   
  
    // Update the HTML element with the results
    resultElement.innerHTML = resultMessage;
  }
  
  
    
    
  