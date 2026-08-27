<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <title>Upload File</title>
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css">
</head>
<body>
  <div class="container mt-5">
    <h2>Upload File</h2>
    <?php if (session()->getFlashdata('message')) : ?>
      <div class="alert <?= session()->getFlashdata('alert-class') ?>"><?= session()->getFlashdata('message') ?></div>
    <?php endif; ?>
    <form method="post" action="<?= base_url('upload'); ?>" enctype="multipart/form-data">
      <div class="form-group">
        <label>Pilih file</label>
        <input type="file" name="file" class="form-control">
      </div>
      <div class="form-group">
        <button type="submit" class="btn btn-danger">Upload</button>
      </div>
    </form>
  </div>
</body>
</html>
