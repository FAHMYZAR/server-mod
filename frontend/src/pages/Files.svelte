<script>
  import { api } from "../lib/api.js";
  import { notify } from "../lib/session.js";
  let files = $state([]);
  let selected = $state(null);
  $effect(() =>
    api
      .files()
      .then((v) => (files = v))
      .catch((e) => notify(e.message, "danger")),
  );
  async function upload() {
    if (!selected) return;
    try {
      await api.upload(selected);
      selected = null;
      files = await api.files();
      notify("File uploaded successfully.");
    } catch (e) {
      notify(e.message, "danger");
    }
  }
  async function remove(name) {
    if (!confirm(`Delete ${name}?`)) return;
    try {
      await api.deleteFile(name);
      files = await api.files();
      notify("File deleted successfully.");
    } catch (e) {
      notify(e.message, "danger");
    }
  }
</script>

<div class="row">
  <div class="col-lg-4">
    <div class="card">
      <div class="card-header bg-dark text-white">Upload File</div>
      <div class="card-body">
        <input
          class="form-control"
          type="file"
          onchange={(e) => (selected = e.target.files[0])}
        /><small class="text-muted"
          >Allowed: jpg, jpeg, docx, pdf, so, ehi · 10 MB max</small
        ><button class="btn btn-danger" disabled={!selected} onclick={upload}
          >Upload</button
        >
      </div>
    </div>
  </div>
  <div class="col-lg-8">
    <div class="card">
      <div class="card-header bg-dark text-white">Files</div>
      <ul class="list-group">
        {#each files as file}<li class="list-group-item split">
            <span>{file.name || file}</span><span
              ><a
                class="btn btn-sm btn-outline-dark"
                href={api.downloadUrl(file.name || file)}
                download>Download</a
              ><button
                class="btn btn-sm btn-danger"
                onclick={() => remove(file.name || file)}>Delete</button
              ></span
            >
          </li>{:else}<li class="list-group-item">No files.</li>{/each}
      </ul>
    </div>
  </div>
</div>
