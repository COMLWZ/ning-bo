; $(function () {
    console.log = function () { };
    document.oncontextmenu = function () {
        return false;
    }
    // 返回顶部显示隐藏
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('footer .back_up_hide').removeClass('back_up_hide');
        } else {
            $('footer .back_up').addClass('back_up_hide');
        }
    });
});

// 头部搜索
// 搜索框
function handleFocus() {
    document.querySelector('header .search_wrap .search_part>.s_pattern').classList.add('show')
}

function handleBlur() {
    document.querySelector('header .search_wrap .search_part>.s_pattern').classList.remove('show')
    document.querySelector('header>.shadow_bg .search_wrap .search_part>.recommend').classList.remove('show')
}

function searchInputToggle(flag) {
    document.querySelector('header>.shadow_bg .search_wrap .search_part>.search_main').classList.toggle('slide')
}
// 搜索模式
function patternCheck(el) {
    let text = el.innerText;
    let input = document.querySelector('header>.shadow_bg .search_wrap #searchInput')
    let p = input.nextElementSibling;
    p.classList.add('show');
    p.children[0].innerText = text;
    input.style.paddingLeft = p.offsetWidth + 'px';
    input.onfocus = null
}

// 搜索框
function searchInput(value) {
    document.querySelector('header .search_wrap .search_part>.s_pattern').classList.remove('show')
    if (value.trim() !== "") {
        document.querySelector('header>.shadow_bg .search_wrap .search_part>.recommend').classList.add('show')
    } else {
        console.log('null');
    }
}

// 小屏头部导航方法
function searchToggle(el) {
    let $m = $('header>.small .menu_wrap');
    if ($m.hasClass('slide')) {
        $m.removeClass('slide')
        // $('body').css({
        //     overflow: 'auto'
        // });
        $('body').removeClass('body_over')
        $m.prev().removeClass('bi-x')
    }
    let $el = $(el).parent().parent().next();
    $el.toggleClass('slide_down');
    if ($el.hasClass('slide_down')) {
        $el.find('input').focus();
    }
}

function slideDown(el) {
    el.classList.toggle('rotate');
    $(el).parent().next().slideToggle();
}

function menuSlide(el) {
    let $el = $(el).next();
    if ($el.hasClass('slide')) {
        $('body').removeClass('body_over');
    } else {
        $('body').addClass('body_over')
        let $s = $('header>.small>.search_slide');
        if ($s.hasClass('slide_down')) {
            $s.removeClass('slide_down')
        }
    }
    el.classList.toggle('bi-x');
    $el.toggleClass('slide');
}
// 工具栏方法 
function openTool(el, type) {
    let $item = $(el).siblings();
    $item.removeClass('bg');
    $item.find('.btn').removeClass('show');
    $(el).find('.btn').toggleClass('show');
    el.classList.toggle('bg')
    switch (type) {
        case 'tel':
            window.location.href = "tel:19957431391";
            break;
        case 'sms':
            window.location.href = "sms:19957431391";
            break;
        case 'mail':
            window.location.href = "mailto:shun_721@163.com"
            break;
    }
}