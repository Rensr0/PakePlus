(function() {
    'use strict';
    
    // 主执行函数
    function main() {
        function hideElements() {
            // 需要隐藏的所有选择器
            var selectors = [
                'div.uzy-top-wrap',
                'div.fright',
                'div.logo',
                'a[title="课堂"]',
                'a[title="机构"]',
                'a[title="社区"]',
                'div.index-right-tools',
                'div.uzy-home-ad',
                'div.foot-right',
                'div#organ-right-home',
                'div.islogined',
                'div.data-column > ul > li.app',
                'div.home-bottom-ad',
                'div.home-left-ad',
                'home-fullpage-ad'
            ];
            selectors.forEach(function(sel) {
                var els = document.querySelectorAll(sel);
                els.forEach(function(el) {
                    el.style.display = 'none';
                });
            });
        }

        // 替换 title
        function replaceTitle() {
            document.title = '领先高考_2025高考志愿填报系统-新高考志愿填报选科指南';
        }

        // 替换文本内容
        function replaceText(node) {
            if (node.nodeType === 3) { // 文本节点
                node.nodeValue = node.nodeValue.replace(/优志愿/g, '领先高考');
            } else if (node.nodeType === 1 && node.childNodes) {
                node.childNodes.forEach(replaceText);
            }
        }

        // 替换所有 logo
        function replaceLogos() {
            // 替换自定义logo图片
            const customLogoUrl = 'https://gaokao.rensr.site/static/images/favicon.png';
            
            // 替换SVG logo
            var logoDiv = document.querySelector('.uzy-head-logo');
            if (logoDiv) {
                var svg = logoDiv.querySelector('svg');
                if (svg) {
                    var img = document.createElement('img');
                    img.src = customLogoUrl;
                    img.style.width = '76px';  // 正方形尺寸
                    img.style.height = '76px'; // 正方形尺寸
                    svg.parentNode.replaceChild(img, svg);
                }
            }
            
            // 替换高考logo
            var gkLogo = document.querySelector('img#gaokaoLogo');
            if (gkLogo) {
                gkLogo.src = customLogoUrl;
                gkLogo.alt = '领先高考';
                gkLogo.title = '领先高考';
                gkLogo.width = 76;  // 设置为正方形
                gkLogo.height = 76; // 设置为正方形
                gkLogo.style.objectFit = 'contain'; // 确保图片比例正确
            }
            
            // 替换SVG图标（登录图标等）
            var svgIcons = document.querySelectorAll('svg.icon[aria-hidden="true"]');
            svgIcons.forEach(function(svgIcon) {
                // 检查是否包含登录图标
                var useElement = svgIcon.querySelector('use[xlink\\:href="#icon-a-15550denglu1x"]');
                if (useElement) {
                    // 创建新的图片元素替换SVG
                    var img = document.createElement('img');
                    img.src = customLogoUrl;
                    img.alt = '领先高考';
                    img.style.width = '76px';
                    img.style.height = '76px';
                    img.style.objectFit = 'contain';
                    svgIcon.parentNode.replaceChild(img, svgIcon);
                }
            });
            
            // 替换favicon
            try {
                var links = document.querySelectorAll("link[rel~='icon']");
                links.forEach(function(link) {
                    link.href = customLogoUrl;
                });
                
                // 确保至少有一个 favicon
                if (links.length === 0) {
                    var link = document.createElement('link');
                    link.rel = 'icon';
                    link.href = customLogoUrl;
                    document.head.appendChild(link);
                }
            } catch(e) {
                console.warn('替换 favicon 失败:', e);
            }
        }

        // 初始执行
        hideElements();
        replaceLogos();
        replaceTitle();
        replaceText(document.body);

        // 监听 DOM 变化
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                mutation.addedNodes.forEach(function(node) {
                    replaceText(node);
                });
            });
            hideElements();
            replaceLogos();
            replaceTitle();
        });
        
        observer.observe(document.body, { childList: true, subtree: true });
        
        console.log('领先高考脚本已注入');
    }

    // 确保 DOM 加载完成
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(main, 100);
    } else {
        document.addEventListener('DOMContentLoaded', main);
    }
})();

// PakePlus 信息
console.log(
    '%cbuild from PakePlus： https://github.com/Sjj1024/PakePlus',
    'color:orangered;font-weight:bolder'
);

// 链接点击处理
const hookClick = (e) => {
    const origin = e.target.closest('a');
    const isBaseTargetBlank = document.querySelector('head base[target="_blank"]');
    
    if (origin && origin.href) {
        // 检查链接是否是 youzy.cn 域名
        const isYouzyLink = origin.href.startsWith('https://www.youzy.cn/') || 
                           origin.href.startsWith('http://www.youzy.cn/');
        
        if (origin.target === '_blank' || isBaseTargetBlank) {
            // 对于 target="_blank" 的链接或存在 base[target="_blank"] 的情况
            if (isYouzyLink) {
                // youzy.cn 链接，在当前窗口打开
                e.preventDefault();
                location.href = origin.href;
            } else {
                // 非 youzy.cn 链接，允许在新窗口打开（不做处理）
            }
        } else {
            // 对于普通链接
            if (!isYouzyLink) {
                // 非 youzy.cn 链接，在新窗口打开
                e.preventDefault();
                // 使用完整URL直接打开，避免about:blank问题
                window.open(origin.href);
            }
            // youzy.cn 链接，允许默认行为（在当前窗口打开）
        }
    }
};

document.addEventListener('click', hookClick, { capture: true });