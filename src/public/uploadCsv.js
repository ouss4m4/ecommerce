const fileInput = document.getElementById('file');
const submitBtn = document.getElementById('submitBtn');

let file = '';

const handleFileUpload = async () => {
  let card = document.createElement('div');
  card.className = 'py-2 px-4 rounded shadow max-w-md';
  let header = document.createElement('div');
  header.className = 'flex flex-col gap-4';
  let title = document.createElement('h2');
  // title = file.
  title.textContent = `${file.name}`;
  header.append(title);
  card.append(header);

  let form = new FormData();
  form.append('items', file);
  let progress = document.createElement('p');
  progress.textContent = 'Processing...';
  header.append(progress);
  document.getElementById('uploads').append(card);

  try {
    let response = await fetch('http://localhost:3001/api/v1/upload/batches', {
      method: 'POST',
      body: form,
    });
    if (!response.ok || !response.body) {
      throw new Error('failed to fetch');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let streamDone = false;
    while (!streamDone) {
      const { value, done } = await reader.read();
      streamDone = done;

      if (value) {
        let text = decoder.decode(value);
        progress.innerHTML = text;
      }
    }
  } catch (err) {
    console.error(err);
  }
};

fileInput.addEventListener('input', function (e) {
  if (e.target.files[0]) {
    file = e.target.files[0];
  }
});

submitBtn.addEventListener('click', handleFileUpload);
