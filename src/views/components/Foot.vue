<template>
  <!-- 底部信息 -->
  <footer class="home-footer">
    <div class="footer-content">
      <div class="footer-section">
        <h4>千源万码</h4>
        <p>学术成果分享平台</p>
        <p>让知识流动起来</p>
      </div>
      <div class="footer-section">
        <h4>快速链接</h4>
        <a href="/about">关于我们</a>
        <a href="/help">帮助中心</a>
        <a href="/contact">联系我们</a>
      </div>
      <div class="footer-section">
        <h4>合作伙伴</h4>
        <a href="/partners">高校合作</a>
        <a href="/partners">企业合作</a>
        <a href="/partners">机构合作</a>
      </div>
    </div>
    <div class="footer-bottom">
      <p>© 2023 千源万码学术平台. 保留所有权利.</p>
    </div>
  </footer>
</template>

<style scoped>
/* 底部样式 */
.home-footer {
  background: var(--footer-bg);
  color: var(--footer-text);
  padding: 40px 20px 20px;
  margin-top: 60px;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
  margin-bottom: 30px;
}

@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
  }
}

.footer-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.footer-section h4 {
  font-size: 18px;
  margin-bottom: 10px;
  color: var(--text-primary);
}

.footer-section a {
  color: var(--text-tertiary);
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s;
}

.footer-section a:hover {
  color: var(--text-primary);
}

.footer-bottom {
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid var(--border-color);
  color: var(--text-tertiary);
  font-size: 14px;
}
</style>