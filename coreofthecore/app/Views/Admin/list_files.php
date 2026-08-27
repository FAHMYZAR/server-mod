<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <title>Daftar File</title>
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css">
</head>
<body>
  <div class="container mt-5">
    <h2>Daftar File</h2>
    <?php if (session()->getFlashdata('message')) : ?>
      <div class="alert alert-info"><?= session()->getFlashdata('message') ?></div>
    <?php endif; ?>
    <ul class="list-group">
      <?php foreach ($files as $file): ?>
        <li class="list-group-item d-flex justify-content-between align-items-center">
          <?= $file ?>
          <a href="<?= base_url('delete_file/'.$file) ?>" class="btn btn-danger btn-sm">Hapus</a>
        </li>
      <?php endforeach; ?>
    </ul>
  </div>
</body>
</html>
