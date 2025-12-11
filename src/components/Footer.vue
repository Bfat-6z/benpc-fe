<template>
  <footer class="text-center text-lg-start mt-5">
    <div class="container py-5">
      <div class="row">
        <!-- About Section -->
        <div class="col-md-4 mb-4 mb-md-0">
          <h5 class="text-danger fw-bold mb-3">AGM Store</h5>
          <p class="text-light">
            Chuyên cung cấp linh kiện PC chính hãng với giá cả cạnh tranh và dịch vụ hỗ trợ tận tâm.
          </p>
          <p class="text-light small">
            Chuyên cung cấp linh kiện PC chính hãng với giá cả cạnh tranh và dịch vụ hỗ trợ tận tâm.
          </p>
        </div>
        <!-- Contact Section -->
        <div class="col-md-4 mb-4 mb-md-0">
          <h5 class="text-danger fw-bold mb-3">Liên hệ</h5>
          <ul class="list-unstyled text-light">
            <li class="mb-2">
              <i class="bi bi-geo-alt-fill me-2 text-danger"></i>123 Lê Lợi, Quận 1, TP.HCM
            </li>
            <li class="mb-2">
              <i class="bi bi-telephone-fill me-2 text-danger"></i>0909 999 999
            </li>
            <li>
              <i class="bi bi-envelope-fill me-2 text-danger"></i>agmstore@gmail.com
            </li>
          </ul>
        </div>
        <!-- Social Media Section -->
        <div class="col-md-4 mb-4 mb-md-0">
          <h5 class="text-danger fw-bold mb-3">Theo dõi</h5>
          <div class="social-icons d-flex justify-content-center justify-content-md-start">
            <a
              href="https://www.facebook.com/profile.php?id=61581934536047"
              target="_blank"
              class="me-3 text-danger"
            >
              <i class="bi bi-facebook fs-4"></i>
            </a>
            <a href="https://www.instagram.com/yourinstapage" target="_blank" class="me-3 text-danger">
              <i class="bi bi-instagram fs-4"></i>
            </a>
            <a href="https://www.youtube.com/youryoutubechannel" target="_blank" class="text-danger">
              <i class="bi bi-youtube fs-4"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
    <div class="text-center py-3 border-top border-secondary bg-dark">
      <small class="text-light">© {{ new Date().getFullYear() }} AGM Store. All rights reserved.</small>
    </div>
  </footer>
</template>

<style scoped>
footer {
  background: linear-gradient(180deg, #212529, #1a1d21);
  color: #bbb;
  padding: 40px 0 10px;
}

footer h5 {
  font-size: 1.25rem;
  letter-spacing: 0.5px;
  position: relative;
  padding-bottom: 10px;
}

footer h5::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 50px;
  height: 2px;
  background-color: #dc3545;
}

footer p,
footer li {
  font-size: 0.95rem;
  line-height: 1.6;
}

footer .social-icons a {
  color: #dc3545;
  margin-right: 15px;
  font-size: 1.8rem;
  transition: all 0.3s ease;
  transform: scale(1);
}

footer .social-icons a:hover {
  color: #fff;
  transform: scale(1.2);
  text-shadow: 0 0 8px rgba(220, 53, 69, 0.6);
}

footer .bg-dark {
  background-color: #1a1d21 !important;
}

footer small {
  font-size: 0.85rem;
  opacity: 0.8;
}
</style>
