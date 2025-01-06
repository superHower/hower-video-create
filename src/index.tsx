import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom'
import './public-path.js'

let root: any;
function render(props: any) {
  const { container } = props
  const dom = container ? container.querySelector('#root') : document.getElementById('root')
  root = createRoot(dom)
  root.render(
    <BrowserRouter basename='/create'>
      <App/>
    </BrowserRouter>
  )
}

// 判断是否在qiankun环境下，非qiankun环境下独立运行
if (!(window as any).__POWERED_BY_QIANKUN__) {
  render({});
}

export async function bootstrap() {
  console.log('react 子应用启动中...');
}

export async function mount(props: any) {
  props.onGlobalStateChange((state: any) => {
    console.log("子应用接收的参数", state.name);
    // state.publicPath && window.localStorage.setItem("curApp", state.name);
  }, true);
  // props.setGlobalState({ count: 2 });
  render(props);
}

// 应用每次 切出/卸载 会调用的方法，通常在这里我们会卸载微应用的应用实例
export async function unmount(props: any) {
  console.log('react 子应用已卸载');
  root.unmount();
}

