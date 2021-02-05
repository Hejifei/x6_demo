import { Graph, Shape, Dom, Addon, } from '@antv/x6';
import { Menu, Toolbar } from '@antv/x6-react-components'
import { Button, Drawer, } from 'antd'
import lodash, { isPlainObject } from 'lodash'
import ActionWrapper from './components/action_wrapper'
import React, {useEffect, useRef, useState} from 'react'
import {
  RedoOutlined,
  UndoOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  VerticalAlignTopOutlined,
  VerticalAlignBottomOutlined,
} from '@ant-design/icons'
import '@antv/x6-react-shape'
import CpParamView, {CP_PARAM_SHOW_TYPE_VALUE, CP_PARAM_SHOW_TYPE_SWITCH} from './components/cp_param_view'
import '@antv/x6-react-components/es/menu/style/index.css'
import '@antv/x6-react-components/es/toolbar/style/index.css'
import './App.css';
import 'antd/dist/antd.css';

const SVG_LOCALSTORAGE_KEY = 'SVG_LOCALSTORAGE_KEY'

const { Dnd } = Addon
const Item = Toolbar.Item 
const Group = Toolbar.Group

const ports_base_config = {
  groups: {
    top: {
      position: 'top',
      attrs: {
        circle: {
          r: 6,
          magnet: true,
          stroke: '#31d0c6',
          strokeWidth: 2,
          fill: '#fff',
          style: {
            visibility: 'hidden',
          }
        },
      },
    },
    bottom: {
      position: 'bottom',
      attrs: {
        circle: {
          r: 6,
          magnet: true,
          stroke: '#31d0c6',
          strokeWidth: 2,
          fill: '#fff',
          style: {
            visibility: 'hidden',
          }
        },
      },
    },
    left: {
      position: 'left',
      attrs: {
        circle: {
          r: 6,
          magnet: true,
          stroke: '#31d0c6',
          strokeWidth: 2,
          fill: '#fff',
          style: {
            visibility: 'hidden',
          }
        },
      },
    },
    right: {
      position: 'right',
      attrs: {
        circle: {
          r: 6,
          magnet: true,
          stroke: '#31d0c6',
          strokeWidth: 2,
          fill: '#fff',
          style: {
            visibility: 'hidden',
          }
        },
      },
    },
  },
  items: [
    {
      group: 'top', // 指定分组名称
    },
    {
      group: 'left',
    },
    {
      group: 'right',
    },
    {
      group: 'bottom',
    },
  ],
}

const node_tools = [{
  name: 'button-remove',
  args: {
    x: '100%',
    y: '0',
    offset: { x: 0, y: -8 },
  }
}]
const edge_tools = ['vertices', 'segments']

Graph.registerReactComponent('myCustomRect', (node) => {
  //  @ts-ignore
  const {title, status, statusColor, params} = node.store.data

  return <CpParamView
    title={title}
    status={status}
    statusColor={statusColor}
    params={params} />
}, true)

function App() {
  const graphRef = useRef()
  const dndRef = useRef()
  const [canRedo, setCanRedo] = useState(false)
  const [canUndo, setCanUndo] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [selectedCell, setSelectedCell] = useState([])

  
  const changePortsVisible = (visible) => {
    const container = document.getElementById('container')
    const ports = container.querySelectorAll(
      '.x6-port-body',
    )
    for (let i = 0, len = ports.length; i < len; i = i + 1) {
      ports[i].style.visibility = visible ? 'visible' : 'hidden'
    }
  }

  useEffect(() => {
    const svgData = localStorage.getItem(SVG_LOCALSTORAGE_KEY)
    let data = {
      nodes: []
    }
    if (svgData) {
      try {
        data = JSON.parse(svgData)
      } catch (err) {
        console.log(err)
        data = {
          nodes: [],
        }  
      }
    }
    if (!isPlainObject(data)) {
      data = {}
    }
    if ((!lodash.has(data, 'nodes')) || (!lodash.isArray(data.nodes))) {
      data.nodes = []
    }

    // const data = {
    //   // 节点
    //   nodes: [
    //     {
    //       id: 'node1', // String，可选，节点的唯一标识
    //       x: 40,       // Number，必选，节点位置的 x 值
    //       y: 40,       // Number，必选，节点位置的 y 值
    //       width: 80,   // Number，可选，节点大小的 width 值
    //       height: 40,  // Number，可选，节点大小的 height 值
    //       angle: 30,
    //       label: 'hello', // String，节点标签
    //       attrs: {
    //         body: {
    //           fill: '#2ECC71',
    //           stroke: '#000',
    //           strokeDasharray: '10,2',
    //         },
    //         label: {
    //           text: 'Hello',
    //           fill: '#333',
    //           fontSize: 13,
    //         },
    //       },
    //       ports: ports_base_config,
    //       tools: node_tools,
    //     },
    //     {
    //       id: 'node2', // String，节点的唯一标识
    //       shape: 'ellipse',
    //       x: 160,      // Number，必选，节点位置的 x 值
    //       y: 180,      // Number，必选，节点位置的 y 值
    //       width: 80,   // Number，可选，节点大小的 width 值
    //       height: 40,  // Number，可选，节点大小的 height 值
    //       label: 'world', // String，节点标签
    //       attrs: {
    //         body: {
    //           fill: '#F39C12',
    //           stroke: '#000',
    //           rx: 16,
    //           ry: 16,
    //         },
    //         label: {
    //           text: 'World',
    //           fill: '#333',
    //           fontSize: 18,
    //           fontWeight: 'bold',
    //           fontVariant: 'small-caps',
    //         },
    //       },
    //       ports: ports_base_config,
    //       tools: node_tools,
    //     },
    //     {
    //       id: 'cp_1',
    //       x: 400,
    //       y: 40,
    //       width: 270,
    //       height: 100,
    //       shape: 'react-shape',
    //       component: 'myCustomRect',
    //       title: 'xxx',
    //       status: '正常',
    //       statusColor: 'green',
    //       params: [
    //         {
    //           metric_no: 'm.0.1',
    //           name: 'name1',
    //           showType: CP_PARAM_SHOW_TYPE_VALUE,
    //           shape: 'circle',
    //           value: 5,
    //           color: 'green',
    //         },
    //         {
    //           metric_no: 'm.0.2',
    //           name: 'name2',
    //           showType: CP_PARAM_SHOW_TYPE_SWITCH,
    //           shape: 'circle',
    //           value: 5,
    //           color: 'red',
    //         },
    //       ],
    //       ports: ports_base_config,
    //       tools: node_tools,
    //     }
    //   ],
    //   // 边
    //   edges: [
    //     {
    //       source: 'node1', // String，必须，起始节点 id
    //       target: 'node2', // String，必须，目标节点 id
    //       // shape: 'double-edge',
    //       attrs: {
    //         line: {
    //           stroke: 'orange',
    //         },
    //       },
    //       router: {
    //         // name: 'orth',
    //         name: 'manhattan',
    //         args: {
    //           startDirections: ['bottom'],
    //           endDirections: ['top'],
    //         },
    //       },
    //       tools: edge_tools,
    //     },
    //   ],
    // };

    const container = document.getElementById('container')
    const {
      clientWidth,
      clientHeight,
    } = container

    const graph = new Graph({
      container,
      width: clientWidth,
      height: clientHeight,
      background: {
        color: '#f0f0f0', // 设置画布背景颜色
      },
      grid: {
        size: 10,      // 网格大小 10px
        visible: false, // 渲染网格背景
      },
      resizing: { //  缩放
        enabled: false,
      },
      rotating: {  //  旋转
        enabled: false,
        grid: 15,
      },
      clipboard: {  //  剪切板
        enabled: false,
      },
      selecting: {
          enabled: false,
          showNodeSelectionBox: true,
          rubberband: true, // 启用框选
      },
      keyboard: { //  键盘快捷键
        enabled: false,
        global: true,
      },
      translating: {
          restrict: true, //  节点无法超过画布区域
      },
      history: false, // 撤销/重做
      // snapline: { //  对齐线
      //     enabled: true,
      //     // graph.disableSnapline()
      //     // graph.enableSnapline()
      // },
      connecting: {
        snap: {
          radius: 50,
        },
        allowBlank: false,  //  是否允许连接到画布空白位置的点，默认为 true
        allowMulti: false,  //  是否允许起始节点和终止节点
        allowLoop: false, //  是否允许创建循环连线
        allowEdge: false, //  是否允许边连接到另一个边
        router: {
          name: 'manhattan',
          // args: {
          //   startDirections: ['bottom'],
          //   endDirections: ['top'],
          // },
        },
        createEdge() {
          return new Shape.Edge({
            attrs: {
              line: {
                stroke: 'orange',
                strokeWidth: 2,
                targetMarker: {
                  name: 'classic',
                  size: 7,
                },
              },
            },
            tools: edge_tools,
          })
        },
        // validateConnection({ sourceView, targetView, targetMagnet }) { //  验证是否可链接
        //   if (!targetMagnet) {
        //     return false
        //   }
        //   if (targetMagnet.getAttribute('port-group') !== 'in') {
        //     return false
        //   }
        //   if (targetView) {
        //     const node = targetView.cell
        //     if (node) {
        //       const portId = targetMagnet.getAttribute('port')
        //       const usedInPorts = node.getUsedInPorts(graph)
        //       if (usedInPorts.find((port) => port && port.id === portId)) {
        //         return false
        //       }
        //     }
        //   }
        //   return true
        // },
      },
      interacting: {
        nodeMovable: false, //  节点是否可以被移动
        edgeMovable: false, //  边是否可以被移动
        // vertexDeletable: true,
      }
    });
    graph.fromJSON(data)
    graphRef.current = graph
    const history = graph.history

    graph.hideTools()  //  隐藏工具

    history.on('change', () => {
      setCanRedo(history.canRedo())
      setCanUndo(history.canUndo())
    })

    const circle = new Shape.Circle({
      id: 'node3',
      x: 280,
      y: 200,
      width: 60,
      height: 60,
      lable: 'circle node3',
    })
    graph.addNode(circle)

    dndRef.current = new Dnd({
      target: graph,
      scaled: true, //  是否根据目标画布的缩放比例缩放拖拽的节点
      animation: true,
      validateNode(droppingNode, options) {
        console.log({
          droppingNode,
          options,
        })
        return droppingNode.shape === 'html'
          ? new Promise((resolve) => {
              const { draggingNode, draggingGraph } = options
              const view = draggingGraph.findView(draggingNode)
              const contentElem = view.findOne('foreignObject > body > div')
              Dom.addClass(contentElem, 'validating')
              setTimeout(() => {
                Dom.removeClass(contentElem, 'validating')
                resolve(true)
              }, 300)
            })
          : true
      },
    })

    graph.bindKey('ctrl+c', () => {
      const cells = graph.getSelectedCells()
      console.log({
        cells,
        // shapes: cells.map(cell => cell.shape)
      })
      if (cells.length) {
          graph.copy(cells.filter(cell => cell.shape !== 'react-shape'))
      }
      return false
    })

    graph.bindKey('ctrl+v', () => {
        if (!graph.isClipboardEmpty()) {
            const cells = graph.paste({ offset: 32 })
            graph.cleanSelection()
            graph.select(cells)
        }
        return false
    })
    
    graph.on('node:mouseenter', () => {
      const isEditing = graph.options.isEditing
      if (isEditing) {
        changePortsVisible(true)
      }
    })
    
    graph.on('node:mouseleave', () => {
      const isEditing = graph.options.isEditing
      if (isEditing) {
        changePortsVisible(false)
      }
    })

    graph.on('node:change:*', (e) => {
      // setSelectedCell([])
      // console.log({
      //   e,
      //   prop: e.cell.getProp(),
      //   attrs: e.cell.getAttrs(),
      // })
    })

    // api: https://x6.antv.vision/zh/docs/tutorial/basic/selection/#gatsby-focus-wrapper
    graph.on('selection:changed', ({ 
      added,
      removed,
      selected,
      options,
    }) => { 
      setSelectedCell(selected)
    })

  }, [])

  const startDrag = (e) => {
    if (!graphRef || !dndRef) {
      return
    }
    const graph = graphRef.current
    const dnd = dndRef.current
    const target = e.currentTarget
    const type = target.getAttribute('data-type')
    const label = target.innerHTML
    const width = target.scrollWidth
    const height = target.scrollHeight
    let node = ''

    if (type === 'html') {
      node = graph.createNode({
        width: 60,
        height: 60,
        shape: 'html',
        html: () => {
          const wrap = document.createElement('div')
          wrap.style.width = '100%'
          wrap.style.height = '100%'
          wrap.style.display = 'flex'
          wrap.style.alignItems = 'center'
          wrap.style.justifyContent = 'center'
          wrap.style.border = '2px solid rgb(49, 208, 198)'
          wrap.style.background = '#fff'
          wrap.style.borderRadius = '100%'
          wrap.innerText = 'HTML'
          return wrap
        },
      })
    } else {
      node = graph.createNode({
        shape: type,
        width: width,   // Number，可选，节点大小的 width 值
        height: height,  // Number，可选，节点大小的 height 值
        // text: label,
        attrs: {
          body: {
            fill: '#fff',
            strokeWidth: 2,
            stroke: '#31d0c6',
          },
          label: {
            fill: '#6a6c8a',
            fontSize: 18,
            text: label, // String，节点标签
          },
        },
        ports: ports_base_config,
        tools: node_tools,
      })
    }
    dnd.start(node, e.nativeEvent)
  }

  const onUndo = () => {
    graphRef.current.history.undo()
  }

  const onRedo = () => {
    graphRef.current.history.redo()
  }

  const saveInfo = () => {
    const graph = graphRef.current
    const data = graph.toJSON()
    // graph.fromJSON //  解析数据
    console.log({
      data
    })
    localStorage.setItem(SVG_LOCALSTORAGE_KEY, JSON.stringify(data))
  }

  const onToFrontOrBack = (isToFront = true) => () => {
    if (selectedCell.length === 0) {
      return
    }
    selectedCell.forEach(cell => {
      if (isToFront) {
        cell.toFront()
      } else {
        cell.toBack()
      }
    })
  }

  const onZIndexChange = (isUp = true) => () => {
    if (selectedCell.length === 0) {
      return
    }
    selectedCell.forEach(cell => {
      const zIndex = cell.getZIndex()
      cell.setZIndex(isUp ? (zIndex + 1) : (zIndex - 1))
    })
  }
  const isCellSelected = selectedCell.length > 0

  let cellInfo = undefined
  const cell = selectedCell.length === 1 ? selectedCell[0] : undefined
  if (cell) {
    const prop = cell.getProp()
    const {
      position,
      size,
      angle,
      attrs,
      shape,
    } = prop
    cellInfo = {
      position,
      size,
      angle,
      attrs,
      shape,
    }
    console.log({
      prop,
      cellInfo,
    })
  }

  const changeEditStatus = () => {
    const myGraph = graphRef.current
    if (!myGraph) {
      return
    }
    myGraph.hideGrid()
    myGraph.disableSelection() // 来启用和禁用选择交互
    console.log({
      myGraph,
      option: myGraph.options,
    })
    if (isEditing) {
      myGraph.toggleMultipleSelection(false)  //  切换多选的启用状态。
      myGraph.toggleSelectionMovable(false) //  切换选中节点/边是否可以被移动。
      myGraph.toggleRubberband(false) //  切换框选的启用状态
      myGraph.disableHistory()
      myGraph.disableKeyboard()  //  禁用键盘
      myGraph.disableSelection()  //  禁用选择能力
      myGraph.disableClipboard()  //  禁用剪切板
      myGraph.hideTools()  //  隐藏工具
      
      myGraph.options.interacting.nodeMovable = false
      myGraph.options.interacting.edgeMovable = false
      myGraph.options.resizing.enabled = false //  缩放
      myGraph.options.rotating.enabled = false  //  旋转
      myGraph.options.isEditing = false
    } else {
      myGraph.showGrid()
      myGraph.toggleMultipleSelection(true)
      myGraph.toggleSelectionMovable(true)
      myGraph.toggleRubberband(true)
      myGraph.enableHistory()
      myGraph.enableKeyboard()   //  启用键盘
      myGraph.enableSelection()   //  启用选择能力
      myGraph.enableClipboard()   //  启用剪切板
      myGraph.showTools()   //  显示工具
      
      myGraph.options.interacting.nodeMovable = true
      myGraph.options.interacting.edgeMovable = true
      myGraph.options.resizing.enabled = true //  缩放
      myGraph.options.rotating.enabled = true  //  旋转
      myGraph.options.isEditing = true
    }
    setIsEditing(!isEditing)
  }

  return (
    <div>
      <Button onClick={changeEditStatus}>
        {isEditing ? '编辑ing' : '编辑'}
      </Button>
      <div className="app">
        <div className="dnd-wrap">
            <div
              data-type="rect"
              className="dnd-rect"
              onMouseDown={startDrag}
            >
              Rect
            </div>
            <div
              data-type="circle"
              className="dnd-circle"
              onMouseDown={startDrag}
            >
              Circle
            </div>
            <div
              data-type="ellipse"
              className="dnd-ellipse"
              onMouseDown={startDrag}
            >
              Ellipse
            </div>
            <div
              data-type="image"
              className="dnd-rect"
              onMouseDown={startDrag}
            >
              Image
            </div>
            <div
              data-type="text-block"
              className="dnd-rect"
              onMouseDown={startDrag}
            >
              text-block
            </div>
            {/* <div
              data-type="html"
              className="dnd-circle"
              onMouseDown={startDrag}
            >
              Html
            </div> */}
          </div>
        <div className="app-right">
          <div className="app-btns">
            <Toolbar >
              {/* <Group>
                <Item name="zoomIn" icon={<ZoomInOutlined />} />
                <Item name="zoomOut" icon={<ZoomOutOutlined />} />
              </Group> */}
              <Group>
                <Item name="undo" icon={<UndoOutlined />} disabled={!canUndo || !isEditing} onClick={onUndo} />
                <Item name="redo" icon={<RedoOutlined />} disabled={!canRedo || !isEditing} onClick={onRedo} />
              </Group>
              <Group>
                <Item name="toFront" icon={<VerticalAlignTopOutlined />} disabled={!isCellSelected} onClick={onToFrontOrBack(true)} />
                <Item name="top" icon={<ArrowUpOutlined />} disabled={!isCellSelected} onClick={onZIndexChange(true)} />
                <Item name="bottom" icon={<ArrowDownOutlined />} disabled={!isCellSelected} onClick={onZIndexChange(false)} />
                <Item name="toBack" icon={<VerticalAlignBottomOutlined />} disabled={!isCellSelected} onClick={onToFrontOrBack(false)} />
              </Group>
            </Toolbar>
          </div>
          <div id="container"></div>
        </div>
        {
          cellInfo && cell &&
            <Drawer
              title="配置"
              width={450}
              mask={false}
              closable={false}
              placement="right"
              visible
            >
              <ActionWrapper
                cell={cell}
                cellInfo={cellInfo}
              />
              {/* <div className="action-wrapper">
              </div> */}
            </Drawer>
        }
      </div>
      <Button onClick={saveInfo}>
        保存为图片
      </Button>
    </div>
  );
}

export default App;
