$('.btn-danger').click(function() {
    if (confirm('确定删除本条数据吗？')) {
        var id = $(this).data('id');
        var classContain = $(this).attr('class');
        var url;
        if (classContain.indexOf('delCate') > -1 ) {
            url = '/admin/cate/del?id='+id
        }else if (classContain.indexOf('delUser') > -1) {
            url = '/admin/user/del?id='+id
        }
        $.ajax({
            type: 'delete',
            url: url,
            success: function(data) {
                if (data.success) {
                    var tr = $('.item-id-'+id);
                    tr.remove();
                }
            }
        })
    }
})