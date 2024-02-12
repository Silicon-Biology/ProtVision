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
  const aminoAcidCount = {};

  // Count occurrences of each amino acid in the sequence
  protein.forEach(base => {
    if (aminoAcidCount.hasOwnProperty(base)) {
      aminoAcidCount[base]++;
    } else {
      aminoAcidCount[base] = 1;
    }
  });

  // Calculate percentages of each amino acid
  const percentages = {};
  for (let aminoAcid in aminoAcidCount) {
    percentages[aminoAcid] = (aminoAcidCount[aminoAcid] / totalLength) * 100;
  }

  // Prepare and display the result message
  let resultMessage = 'Amino Acid\tOccurrences\tPercentage\n';
  for (let aminoAcid in aminoAcidCount) {
    resultMessage += `${aminoAcid}\t\t${aminoAcidCount[aminoAcid]}\t\t${percentages[aminoAcid].toFixed(4)}%\n`;
  }

  // Update the HTML element with the results
  resultElement.innerHTML = resultMessage;
}


  
  
  function processSequence(data, resultElement) {
    const data2 = data.toUpperCase();
    const protein = data2.split('');
    const totalLength = protein.length;
    const aminoAcidCount = {};

    // Count occurrences of each amino acid in the sequence
    protein.forEach(base => {
        if (aminoAcidCount.hasOwnProperty(base)) {
            aminoAcidCount[base]++;
        } else {
            aminoAcidCount[base] = 1;
        }
    });

    // Calculate percentages of each amino acid
    const percentages = {};
    for (let aminoAcid in aminoAcidCount) {
        percentages[aminoAcid] = (aminoAcidCount[aminoAcid] / totalLength) * 100;
    }

    // Prepare and display the result message
    let resultMessage = 'Amino Acid\tOccurrences\tPercentage\n';
    for (let aminoAcid in aminoAcidCount) {
        resultMessage += `${aminoAcid}\t\t${aminoAcidCount[aminoAcid]}\t\t${percentages[aminoAcid].toFixed(4)}%\n`;
    }

    // Update the HTML element with the results
    resultElement.innerHTML = resultMessage;
}

