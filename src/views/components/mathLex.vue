<template>
  <div ref="mathContainer">
    <slot></slot>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted, watch, nextTick } from 'vue';

export default defineComponent({
  name: 'MathJax',
  props: {
    formula: {
      type: String,
      default: ''
    },
    display: {
      type: Boolean,
      default: false
    }
  },
  setup(props, {slots}) {
    const mathContainer = ref(null);

    // 检查是否已加载 MathJax
    const isMathJaxLoaded = () => {
      return window.MathJax && window.MathJax.tex2chtml;
    };

    // 加载 MathJax
    const loadMathJax = () => {
      return new Promise((resolve) => {
        if (isMathJaxLoaded()) {
          resolve();
          return;
        }

        // 配置 MathJax
        window.MathJax = {
          startup: {
            typeset: false, // 禁用自动排版
            ready: () => {
              MathJax.startup.defaultReady();
              resolve();
            }
          },
          tex: {
            inlineMath: [['$', '$'], ['\\(', '\\)']],
            displayMath: [['$$', '$$'], ['\\[', '\\]']],
            processEscapes: true,
            tags: 'ams'
          },
          options: {
            skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code'],
            ignoreHtmlClass: 'no-mathjax'
          }
        };

        // 动态加载 MathJax
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js';
        script.async = true;
        script.onload = () => {
          // MathJax 加载完成后会调用 startup.ready
        };
        document.head.appendChild(script);
      });
    };

    // 渲染数学公式
    const renderMath = async () => {
      if (!mathContainer.value) return;

      await loadMathJax();
      await nextTick(); // 等待 DOM 更新

      // 使用 MathJax 3.x 的正确 API
      if (window.MathJax.typesetPromise) {
        try {
          await window.MathJax.typesetPromise([mathContainer.value]);
        } catch (error) {
          console.error('MathJax typeset error:', error);
        }
      } else if (window.MathJax.tex2chtmlPromise) {
        // 备选方案：手动处理每个公式
        const elements = mathContainer.value.querySelectorAll('.math-tex');
        for (const element of elements) {
          try {
            const tex = element.textContent;
            const display = element.classList.contains('math-display');
            const node = await window.MathJax.tex2chtmlPromise(tex, {display});
            element.replaceWith(node);
          } catch (error) {
            console.error('MathJax conversion error:', error);
          }
        }
      }
    };

    onMounted(() => {
      renderMath();
    });

    watch(() => props.formula, () => {
      renderMath();
    });

    return {mathContainer};
  }
});
</script>

<style>
.math-container {
  display: inline;
}

.math-display {
  display: block;
  margin: 1em 0;
  text-align: center;
}
</style>