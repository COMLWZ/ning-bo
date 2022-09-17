; $(function () {
    lazyLoad();
    windowResize();
    window.onresize = windowResize;
});

function lazyLoad() {
    $("img.lazy").lazyload({
        placeholder: "./assets/images/img_loading.gif", //用图片提前占位
        effect: "fadeIn", // 载入使用何种效果
        // effect(特效),值有show(直接显示),fadeIn(淡入),slideDown(下拉)等,常用fadeIn
        threshold: 500, // 提前开始加载
        // threshold,值为数字,代表页面高度.如设置为200,表示滚动条在离目标位置还有200的高度时就开始加载图片,可以做到不让用户察觉
        failurelimit: 10 // 图片排序混乱时
        // failurelimit,值为数字.lazyload默认在找到第一张不在可见区域里的图片时则不再继续加载,但当HTML容器混乱的时候可能出现可见区域内图片并没加载出来的情况,failurelimit意在加载N张可见区域外的图片,以避免出现这个问题.
        // event: 'click',  // 事件触发时才加载
        // event,值有click(点击),mouseover(鼠标划过),sporty(运动的),foobar(…).可以实现鼠标莫过或点击图片才开始加载,后两个值未测试…
        // container: $("#container"),  // 对某容器中的图片实现效果
        // container,值为某容器.lazyload默认在拉动浏览器滚动条时生效,这个参数可以让你在拉动某DIV的滚动条时依次加载其中的图片
    });
}

let swipeFlag = 0;

function windowResize() {
    let w = window.innerWidth;
    if (w < 510) {
        if (swipeFlag === 1) return;
        swipeFlag = 1;
        let $swiper = $('#artSwiper');
        dotAddClick($swiper, 3, 1)
        addDom($swiper, 1, 1)
        mySwiper($swiper, true, 150, 3)
    } else if (w < 800) {
        if (swipeFlag === 2) return;
        swipeFlag = 2;
        let $swiper = $('#artSwiper');
        dotAddClick($swiper, 2, 0.5);
        addDom($swiper, 2, 3);
        mySwiper($swiper, true, 250, 2)
    } else {
        if (swipeFlag !== 0) {
            swipeFlag = 0;
            let $swiper = $('#artSwiper');
            $swiper.find('.add_dom').remove();
            $swiper.css({
                transform: `translateX(0)`
            });
            mySwiper($swiper, false)
        }
    }
}

/* 滑动轮播方法 */
// 前后添加dom元素
function addDom($selector, before, after) {
    $selector.find('.add_dom').remove();
    let $b_items = $selector.find(`>div:gt(-${before + 1})`).clone(true);
    let $a_items = $selector.find(`>div:lt(${after})`).clone(true);
    $b_items.addClass('add_dom');
    $a_items.addClass('add_dom');
    $b_items.each((_i, el) => {
        let $img = $(el).find('img');
        $img.attr('src', $img.attr('data-original'));
    });
    $a_items.each((_i, el) => {
        let $img = $(el).find('img');
        $img.attr('src', $img.attr('data-original'));
    });
    $selector.prepend($b_items)
    $selector.append($a_items)
    let $active = $('.latest_blog>.slick_dots>.active');
    let index = $active.index() + 1;
    if (before > 1 && index > 1) {
        $selector.css({
            transform: `translateX(${-150}%)`
        });
    } else {
        $selector.css({
            transform: `translateX(${-100 * index}%)`
        });
    }
}

// 指示器圆点 点击
function dotAddClick($selector, count, offsetX) {
    let $dots = $('.latest_blog>.slick_dots');
    let $lis = $dots.find('li');
    let len = $lis.length;
    let $active = $dots.find('.active')
    let index = $active.index()
    // 添加或删除多余指示圆点
    if (len < count) {
        for (let i = len; i < count; i++) {
            let li = document.createElement('li');
            $dots.append(li);
        }
        if (index > 0) {
            $active.removeClass('active');
            $active.next().addClass('active');
        }
    } else {
        if (index > 0) {
            $active.removeClass('active');
            $active.prev().addClass('active');
        }
        for (let i = count; i < len; i++) {
            $lis.last().remove();
        }
    }
    len !== count ? $lis = $dots.find('li') : null;
    $lis.each((i, el) => {
        el.onclick = function () {
            if (i === 0) {
                $selector.css({
                    transform: `translateX(-100%)`,
                    transition: '0.5s ease-in-out'
                });
            } else {
                $selector.css({
                    transform: `translateX(${(i + offsetX) * -100}%)`,
                    transition: '0.5s ease-in-out'
                });
            }
            $lis.removeClass('active');
            el.classList.add('active');
        }
    });
}

// 滑动 鼠标按住滚动
function mySwiper($selector, flag, step = 50, swipeItem = 2) {
    let startX = endX = distanceX = positionLeft = 0;
    let drag = false; // 是否允许鼠标拖动

    function touchStart(event, type = 'touch') {
        event.preventDefault();
        drag = true;
        distanceX = 0;
        if (type === 'touch') {
            let touch = event.targetTouches[0];
            startX = touch.clientX;
        } else {
            startX = event.clientX;
            document.body.style.cursor = 'move'
        }
        positionLeft = Math.round($selector.position().left);
    }

    function touchMove(event, type = 'touch') {
        if (!drag) return;
        if (type === 'touch') {
            let touch = event.targetTouches[0];
            endX = touch.clientX;
        } else {
            endX = event.clientX;
        }
        distanceX = endX - startX;
        $selector.css({
            transform: `translateX(${positionLeft + distanceX}px)`,
            transition: '0s'
        });
    }

    function touchEnd(event, type = 'touch') {
        if (!drag) return;
        drag = false;
        document.body.style.cursor = 'auto'
        if (distanceX === 0) return;
        $selector.css({
            transition: '0.5s ease-in-out'
        });
        // let pageWidth = document.body.offsetWidth || window.screen.width ;
        // let percent = positionLeft / pageWidth;
        let pageWidth = $(window).width();
        let percent = Math.round(positionLeft / pageWidth * 10) / 10;
        if (Math.abs(distanceX) > step) {
            if (swipeItem > 2) {
                percent = Math.round(percent);
                if (distanceX > 0) {
                    $selector.css({
                        transform: `translateX(${(percent + 1) * 100}%)`
                    });
                    changeActiveDot('prev');
                } else {
                    $selector.css({
                        transform: `translateX(${(percent - 1) * 100}%)`
                    });
                    changeActiveDot('next');
                }

                let trans = $selector[0].style.transform;
                let left = trans.split('(')[1].split(')')[0];
                left = parseFloat(left);
                if (left > -10 && left < 10) {
                    $selector.animate({
                        transform: `translateX(0%)`
                    }, function () {
                        $selector.css({
                            transform: `translateX(${-swipeItem * 100}%)`,
                            transition: '0s'
                        });
                    })
                } else if (left > (-swipeItem - 1) * 100 - 10 && left < (-swipeItem - 1) * 100 + 10) {
                    $selector.animate({
                        transform: `translateX(${(-swipeItem - 1) * 100}%)`
                    }, function () {
                        $selector.css({
                            transform: `translateX(-100%)`,
                            transition: '0s'
                        });
                    })
                }
            } else {
                if (distanceX > 0) {
                    if (percent < -1.25) {
                        $selector.css({
                            transform: `translateX(${(percent + 0.5) * 100}%)`
                        });
                    } else {
                        $selector.css({
                            transform: `translateX(${(percent + 1) * 100}%)`
                        });
                    }
                    changeActiveDot('prev');
                } else {
                    if (percent > -1.25) {
                        $selector.css({
                            transform: `translateX(${(percent - 0.5) * 100}%)`
                        });
                    } else {
                        $selector.css({
                            transform: `translateX(${(percent - 1) * 100}%)`
                        });
                    }
                    changeActiveDot('next');
                }

                let trans = $selector[0].style.transform;
                let left = trans.split('(')[1].split(')')[0];
                left = parseFloat(left);
                if (left > -10 && left < 10) {
                    $selector.animate({
                        transform: `translateX(0%)`
                    }, function () {
                        $selector.css({
                            transform: `translateX(${-(swipeItem - 0.5) * 100}%)`,
                            transition: '0s'
                        });
                    })
                } else if (left > (-swipeItem - 0.5) * 100 - 10 && left < (-swipeItem - 0.5) * 100 + 10) {
                    $selector.animate({
                        transform: `translateX(${(-swipeItem - 0.5) * 100}%)`
                    }, function () {
                        $selector.css({
                            transform: `translateX(-100%)`,
                            transition: '0s'
                        });
                    })
                }
            }
        } else {
            $selector.css({
                transform: `translateX(${percent * 100}%)`
            });
        }
    }

    $selector.off('touchstart');
    $selector.off('touchmove');
    $selector.off('touchend');
    $selector.off('mousedown');
    $(document).off('mousemove');
    $(document).off('mouseup');

    if (flag) {
        $selector.on('touchstart', touchStart);
        $selector.on('touchmove', touchMove);
        $selector.on('touchend', touchEnd);
        $selector.on('mousedown', function (event) {
            touchStart(event, 'mouse')
        });
        $(document).on('mousemove', function (event) {
            touchMove(event, 'mouse');
        });
        $(document).on('mouseup', function (event) {
            touchEnd(event, 'mouse');
        })
    }
}

// 改变指示器active圆点
function changeActiveDot(tag) {
    let $dots = $('.latest_blog>.slick_dots');
    let $active = $dots.find('.active');
    $active.removeClass('active');
    if (tag === 'prev') {
        let $prev = $active.prev();
        if ($prev.length !== 0) {
            $prev.addClass('active');
        } else {
            $dots.find('li:last').addClass('active');
        }
    } else {
        let $next = $active.next();
        if ($next.length !== 0) {
            $next.addClass('active');
        } else {
            $dots.find('li:first').addClass('active');
        }
    }
}

function swing(e) {
    e.classList.add('animate__animated', 'animate__swing')
    e.addEventListener('animationend', () => {
        e.classList.remove('animate__animated', 'animate__swing');
    });
}

function tabMouseEnter(e) {
    $(e).siblings().removeClass('active');
    e.classList.add('active');
}

function fadeRight(i) {
    let $els = $('.our_products .img_show>.img_wrap>.img_item');
    $els.removeClass('active')
    $els.eq(i).addClass('active');
}