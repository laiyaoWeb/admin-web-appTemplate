(function() {
	Vue.prototype.$ELEMENT = { size: 'medium' };
	
	var validateConfirmPassword = function(rule, value, callback){
	    if (this.dataForm.newPassword !== value) {
	      callback(new Error('确认密码与新密码不一致'))
	    } else {
	      callback()
	    }
	}
	var vm = window.vm = new Vue({
		el: '.aui-wrapper',
		data: function() {
			return {
				// 滚动条, 滚动高度
				scrollbarHeight: 0,
				// DOM Element对象
				DOM: {},
				// 加载中
				loading: true,
				// 容器, 居中
				wrapperCenter: false,
				// 头部, 皮肤 (white 白色 / colorful 鲜艳)
				headerSkin: 'colorful',
				// 头部, 固定状态
				headerFixed: false,
				// 侧边, 皮肤 (white 白色 / dark 黑色)
				asideSkin: 'dark',
				// 侧边, 固定状态
				asideFixed: false,
				// 侧边, 折叠状态
				asideFold: false,
				// 侧边, 至头部状态
				asideTop: false,
				// 侧边, 菜单显示状态 (控制台“至头部”操作时, el-menu组件需根据mode属性重新渲染)
				asideMenuVisible: true,
				// 侧边, 菜单选中
				asideMenuActive: '1',
				// 搜索, 显示状态
				searchVisible: false,
				// 搜索, 值
				search: '',
				// 控制台, 固定状态
				controlFixed: false,
				// 控制台, 打开状态
				controlOpen: false,
				// 控制台, 标签页选中
				controlTabsActive: 'layout',
				// 主内容, 展示类型 (standard 标准 / tabs 标签页)
				// mainType: 'standard', 
				mainType: 'tabs',
				// 主标签页, 列表
				mainTabs: [],
				// 主标签页, 选中
				mainTabsActive: 'home',
				// 主标签页, 头部固定状态
				mainTabsHeaderFixed: false,
				// 皮肤, 默认值
				skin: 'turquoise',
				// 皮肤, 列表
				skinList: [{
						name: 'blue',
						color: '#3E8EF7',
						remark: '蓝色'
					},
					{
						name: 'brown',
						color: '#997B71',
						remark: '棕色'
					},
					{
						name: 'cyan',
						color: '#0BB2D4',
						remark: '青色'
					},
					{
						name: 'gray',
						color: '#757575',
						remark: '灰色'
					},
					{
						name: 'green',
						color: '#11C26D',
						remark: '绿色'
					},
					{
						name: 'indigo',
						color: '#667AFA',
						remark: '靛青色'
					},
					{
						name: 'orange',
						color: '#EB6709',
						remark: '橙色'
					},
					{
						name: 'pink',
						color: '#F74584',
						remark: '粉红色'
					},
					{
						name: 'purple',
						color: '#9463F7',
						remark: '紫色'
					},
					{
						name: 'red',
						color: '#FF4C52',
						remark: '红色'
					},
					{
						name: 'turquoise',
						color: '#17B3A3',
						remark: '蓝绿色'
					},
					{
						name: 'yellow',
						color: '#FCB900',
						remark: '黄色'
					}
				],
				screenfullStatus: false,
				indexNoticeTabsActive: '1',
				indexPersonalTabsActive: '1',
				menuList: [], // slider菜单;
				contentLoading: false,
				routerList: [],
				tabs: [
					{
						path: '/home',
						label: '首页',
						id: 'home',
						icon: '#icon-home',
						indexNum: ''
					}
				],
				visible: false,
				userName: 'admin',
		        dataForm: {
		          password: '',
		          newPassword: '',
		          confirmPassword: ''
		        },
		        dataRule: {
		          password: [
		            { required: true, message: '原密码不能为空', trigger: 'blur' }
		          ],
		          newPassword: [
		            { required: true, message: '新密码不能为空', trigger: 'blur' }
		          ],
		          confirmPassword: [
		            { required: true, message: '确认密码不能为空', trigger: 'blur' },
		            { validator: validateConfirmPassword, trigger: 'blur' }
		          ]
		        }
			}
		},
		watch: {
			scrollbarHeight: function(val) {
				vm.yLayoutFixedHandle();
			},
			wrapperCenter: function(val) {
				vm.headerFixed = false;
				vm.asideFixed = false;
				vm.controlFixed = false;
				vm.mainTabsHeaderFixed = false;
			},
			headerFixed: function(val) {
				vm.yLayoutFixedHandle();
			},
			asideFixed: function(val) {
				vm.yLayoutFixedHandle();
			},
			asideTop: function(val) {
				vm.yLayoutFixedHandle();
				vm.asideMenuVisible = false;
				vm.$nextTick(function() {
					vm.asideMenuVisible = true;
				});
			},
			controlFixed: function(val) {
				vm.yLayoutFixedHandle();
			},
			mainTabsHeaderFixed: function(val) {
				vm.yLayoutFixedHandle();
			}
		},
		beforeCreate: function() {
			vm = this;
		},
		created: function() {
			vm.loading = false;
			vm.$nextTick(function() {
				//vm.scrollbarHandle(true);
				//vm.getDOM();
			});
			vm.getMenuData();
		},
		methods: {
			// 滚动条, 滚动距离
			scrollbarHandle: function(isInit) {
				if(isInit && typeof(isInit) === 'boolean') {
					window.addEventListener('scroll', vm.scrollbarHandle);
				}
				vm.scrollbarHeight = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
			},
			// 获取DOM Element对象
			getDOM: function() {
				vm.DOM.header  = vm.$refs.auiWrapper.querySelector('.aui-header');
	            vm.DOM.aside   = vm.$refs.auiWrapper.querySelector('.aui-aside');
	            vm.DOM.control = vm.$refs.auiWrapper.querySelector('.aui-control');
	            vm.DOM.main    = vm.$refs.auiWrapper.querySelector('.aui-main');
	            vm.DOM.mainTabsTool   = vm.DOM.main.querySelector('.aui-main-tabs__tool');
	            vm.DOM.mainTabsHeader = vm.DOM.main.querySelector('.aui-main-tabs > .el-tabs__header');
	           
			},
			// Y轴布局固定
			yLayoutFixedHandle: function() {
				var _offsetHeight = vm.scrollbarHeight >= vm.DOM.header.offsetHeight ? 0 : vm.DOM.header.offsetHeight - vm.scrollbarHeight;
				// 侧边
				if(!vm.headerFixed && vm.asideTop && vm.asideFixed) {
					vm.DOM.aside.style.top = _offsetHeight + 'px';
				} else {
					vm.DOM.aside.style.removeProperty('top');
				}
				// 控制台
				if(!vm.headerFixed && vm.controlFixed) {
					vm.DOM.control.style.top = _offsetHeight + 'px';
				} else {
					vm.DOM.control.style.removeProperty('top');
				}
				// 主标签页, 头部
				if(!vm.headerFixed && vm.mainTabsHeaderFixed) {
					if(vm.asideTop && vm.asideFixed) {
						_offsetHeight += vm.DOM.aside.offsetHeight;
					}
					if(vm.asideTop && !vm.asideFixed) {
						_offsetHeight = vm.scrollbarHeight >= vm.DOM.header.offsetHeight + vm.DOM.aside.offsetHeight ? 0 : vm.DOM.header.offsetHeight + vm.DOM.aside.offsetHeight - vm.scrollbarHeight;
					}
					vm.DOM.mainTabsTool.style.top = _offsetHeight + 'px';
					vm.DOM.mainTabsHeader.style.top = _offsetHeight + 'px';
				} else {
					vm.DOM.mainTabsTool.style.removeProperty('top');
					vm.DOM.mainTabsHeader.style.removeProperty('top');
				}
			},
			// 跳转页面
			gotoPageHandle: function(url) {
				if(!/\S/.test(url) || location.href.indexOf(url.replace(/^(\.*\/)*/, '')) !== -1) {
					return false;
				}
				console.log(url);
				window.location.href = url;
			},
			// 皮肤切换
			skinChangeHandle: function(val) {
				var styleList = [{
						id: 'J_elementTheme',
						url: './element-theme/' + val + '/index.css?t=' + new Date().getTime()
					},
					{
						id: 'J_auiSKin',
						url: './css/aui-' + val + '.min.css?t=' + new Date().getTime()
					}
				];
				for(var i = 0; i < styleList.length; i++) {
					var el = document.getElementById(styleList[i].id);
					if(el) {
						el.href = styleList[i].url;
						continue;
					}
					el = document.createElement('link');
					el.id = styleList[i].id;
					el.href = styleList[i].url;
					el.rel = 'stylesheet';
					document.getElementsByTagName('head')[0].appendChild(el);
				}
			},
			refreshPageHandle: function(){ // 刷新当前页面;
				location.reload();		
			},
			fullscreenHandle: function(){ // 全屏按钮
				this.screenfullStatus = !this.screenfullStatus;
				if (screenfull.enabled) {
					this.screenfullStatus ? screenfull.request(): screenfull.exit();
				}			
			},
			getMenuData: function(){
				axios.get('./data/menuData.json').then(function (res) {
		            vm.menuList = res.data;
		            vm.routerList = vm.filterRouterData(res.data);
		            vm.initRouter(vm.routerList);
		            vm.loading = false;
		        }).catch(function (error) {
		            console.log(error);
		        });
			},
			initRouter: function(routerList){ // 初始化路由
				var that = this;
				for( var i = 0; i < routerList.length; i++){
		            var path = routerList[i].path;
		            spaRouters.map(path, function(transition){
		                var parmas = {url: transition.path };
		                var pathUrl = './pages' + parmas.url + '.html'; 
		                routerList.forEach(function(val, index){
                			if(val['path'] === parmas.url){
                				that.createTabsItem(val['id']);
                			}
                		});
                		vm.contentLoading = true;
		                axios.get(pathUrl).then(function (res) {
		                    // vm.loading = false;
		                    if(res.data.indexOf('id="loginApp"') != -1){
		                        location.href = ctx;
		                    }else{
	                    		for(var j=0; j < that.tabs.length; j++){
									if(that.tabs[j]['path'] == parmas.url){
										var id = '#' + parmas.url.split('/')[1] + '-app-wrap';
										$(id).empty();
										$(id).html(res.data);
										break;
									}
								}
		                    	
		                    }
		                    setTimeout(function(){
		                    	vm.contentLoading = false;
		                    }, 1000);
		                    
		                });
		            });
		        }
		        var startPath = routerList[0].path;
		        var currentUrl = window.location.hash.replace(/#/, '');
		        spaRouters.init();
		        if(currentUrl != startPath){
		        	this.initHomeTemplatePage(); // 初始化首页, 防止页面刷新后出现空白;
		        }
		        spaRouters.beforeEach(function(transition){
			        setTimeout(function(){
			            transition.next()
			        },100)
			    });
			    spaRouters.afterEach(function(transition){
			        console.log("切换之后dosomething")
			    });
			},
			initHomeTemplatePage: function() {
				var pathUrl = './pages/home.html'; 
				vm.contentLoading = true;
				axios.get(pathUrl).then(function (res) {
                    $("#home-app-wrap").empty();
					$("#home-app-wrap").html(res.data);
					vm.contentLoading = false;
                });
			},
			filterRouterData: function (listArr){ // 获取注册路由列表
		        var targetArr = [];
		        for(var i=0; i<listArr.length;i++){
		            if(listArr[i].children.length == 0){
		                targetArr = targetArr.concat(listArr[i]);
		            } else {
		                targetArr = targetArr.concat(listArr[i].children);
		            }
		        }
		        return targetArr;
		    },
		    createTabsItem: function(id){
		    	// 根据id 从routerList中获取关联数据;
		    	var obj = null;
		    	vm.routerList.forEach(function(val){
					if(val.id === id){
						obj = {
							path: val.path,
							label: val.name,
							id: val.id,
							icon: '',
							indexNum: val.indexNum
						}		
					}
				});
		    	
				for(var i = 0; i < this.tabs.length; i++){
					if(this.tabs[i]['path'] == obj.path){
						break;
					} else {
						if(i == (this.tabs.length-1)){
							this.tabs.push(obj);
							break;
						}
					}
				}
				this.mainTabsActive = id;
				this.asideMenuActive = obj.indexNum;
		    },
			menuItemClick: function(name, id, path) {
				var that = this;
				window.location.hash = '#' + path;
				that.createTabsItem(id);
			},
			removeTab: function(targetId) { // 关闭当前标签
		        var tabs = this.tabs;
		        var activeName = this.mainTabsActive;
		        if (activeName === targetId) {
		          tabs.forEach(function (tab, index) {
		            if (tab.id === targetId) {
		              var nextTab = tabs[index + 1] || tabs[index - 1];
		              if (nextTab) {
		                activeName = nextTab.id;
		                window.location.hash = '#' + nextTab.path;
		              }
		            }
		          });
		        }
		        this.mainTabsActive = activeName;
        		this.tabs = tabs.filter(function(tab){ return tab.id !== targetId });
		   },
		    handleCommand: function(command){
		    	var that = this;
		    	var tabs = this.tabs;
		    	if(command === 'a'){// 关闭当前标签
		    		if(this.mainTabsActive != this.tabs[0].id){
		    			this.removeTab(this.mainTabsActive);
		    		}
		    	} else if(command === 'b'){// 关闭其他标签
		    		this.tabs = tabs.filter(function(tab){ 
		    			return tab.id === that.tabs[0].id || tab.id === that.mainTabsActive;
		    		});
		    	} else if(command === 'c'){// 关闭所有标签
		    		this.tabs = tabs.filter(function(tab){ 
		    			return tab.id === that.tabs[0].id;
		    		});
		    		this.mainTabsActive = that.tabs[0].id;
		    	}
		    },
		   	changeTabs: function(e){
		   		var that = this;
		   		vm.routerList.forEach(function(val, index){
					if(val.id === e.name){
						that.asideMenuActive = val.indexNum;
					}
				});
		   	},
		   	 // 修改密码
		    updatePasswordHandle: function() {
		    	var that = this;
		        this.visible = true;
		        this.$nextTick(function(){
		          this.$refs['dataForm'].resetFields()
		        });
		    },
		      // 表单提交
		    dataFormSubmit: function() {
		        this.$refs['dataForm'].validate(function(valid){
		          if (valid) {
//		            this.$http({
//		              url: this.$http.adornUrl('/sys/user/password'),
//		              method: 'post',
//		              data: this.$http.adornData({
//		                'password': this.dataForm.password,
//		                'newPassword': this.dataForm.newPassword
//		              })
//		            }).then(({data}) => {
//		              if (data && data.code === 0) {
//		                this.$message({
//		                  message: '操作成功',
//		                  type: 'success',
//		                  duration: 1500,
//		                  onClose: () => {
//		                    this.visible = false
//		                    this.$nextTick(() => {
//		                      this.mainTabs = []
//		                      clearLoginInfo()
//		                      this.$router.replace({ name: 'login' })
//		                    })
//		                  }
//		                })
//		              } else {
//		                this.$message.error(data.msg)
//		              }
//		            })
		          }
		        })
		    },
		   	logoutHandle: function(){
		   		var that = this;
		        this.$confirm('确定进行[退出]操作?', '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
		        }).then(function(){
//		          that.$http({
//		            url: this.$http.adornUrl('/sys/logout'),
//		            method: 'post',
//		            data: that.$http.adornData()
//		          }).then(function(data){
//		            if (data && data.code === 0) {
//		              clearLoginInfo()
//		              that.$router.push({ name: 'login' })
//		            }
//		          })
		        }).catch(function(){})
		    }
		}
	});
})();