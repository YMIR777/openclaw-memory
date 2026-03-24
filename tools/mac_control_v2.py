#!/usr/bin/env python3
"""
OpenClaw Mac 控制工具 - 改进版
支持长连接、精确坐标、批量操作
"""
import os
import sys
import json
import time

# 添加 vnc_client 路径
sys.path.insert(0, os.path.expanduser('~/mcp-remote-macos-use/src'))
import vnc_client

# 配置
MACOS_HOST = os.environ.get('MACOS_HOST', 'localhost')
MACOS_USERNAME = os.environ.get('MACOS_USERNAME', 'Ymir')
MACOS_PASSWORD = os.environ.get('MACOS_PASSWORD', '1314')

class MacController:
    def __init__(self):
        self.client = None
        self.connected = False
    
    def connect(self):
        if self.connected and self.client:
            return True, "Already connected"
        
        self.client = vnc_client.VNCClient(
            host=MACOS_HOST,
            port=5900,
            username=MACOS_USERNAME,
            password=MACOS_PASSWORD
        )
        success, msg = self.client.connect()
        self.connected = success
        return success, msg
    
    def disconnect(self):
        if self.client:
            self.client.close()
            self.client = None
        self.connected = False
    
    def get_screen_size(self):
        # 从 VNC 连接获取屏幕尺寸
        if not self.connected:
            return 2880, 1800  # 默认尺寸
        # VNC client 在连接时已获取屏幕信息
        return 2880, 1800
    
    def screenshot(self):
        if not self.connected:
            self.connect()
        
        screenshot = self.client.capture_screen()
        if screenshot:
            path = "/tmp/mac_screenshot.png"
            with open(path, "wb") as f:
                f.write(screenshot)
            return {"success": True, "path": path, "size": len(screenshot)}
        return {"error": "无法获取截图"}
    
    def click(self, x, y, button=1):
        if not self.connected:
            self.connect()
        
        self.client.send_mouse_click(int(x), int(y), button=button)
        return {"success": True, "action": "click", "x": x, "y": y}
    
    def move(self, x, y):
        if not self.connected:
            self.connect()
        
        self.client.send_pointer_event(int(x), int(y), 0)
        return {"success": True, "action": "move", "x": x, "y": y}
    
    def type(self, text):
        if not self.connected:
            self.connect()
        
        self.client.send_text(text)
        return {"success": True, "action": "type", "text": text}
    
    def key(self, keycode):
        """发送单个按键"""
        if not self.connected:
            self.connect()
        
        self.client.send_key_event(keycode, True)
        self.client.send_key_event(keycode, False)
        return {"success": True, "action": "key", "keycode": keycode}
    
    def double_click(self, x, y):
        if not self.connected:
            self.connect()
        
        self.client.send_mouse_click(int(x), int(y), button=1, double_click=True)
        return {"success": True, "action": "double_click", "x": x, "y": y}
    
    def drag(self, x1, y1, x2, y2):
        """拖拽从 (x1,y1) 到 (x2,y2)"""
        if not self.connected:
            self.connect()
        
        # 按下
        self.client.send_pointer_event(int(x1), int(y1), 1)
        time.sleep(0.1)
        # 移动到目标
        self.client.send_pointer_event(int(x2), int(y2), 1)
        time.sleep(0.1)
        # 松开
        self.client.send_pointer_event(int(x2), int(y2), 0)
        return {"success": True, "action": "drag", "from": (x1, y1), "to": (x2, y2)}


# 全局控制器，保持连接
_controller = MacController()

if __name__ == "__main__":
    # 解析命令
    if len(sys.argv) < 2:
        print(json.dumps({"error": "用法: mac_control.py <command> [args]"}))
        sys.exit(1)
    
    cmd = sys.argv[1]
    
    try:
        if cmd == "connect":
            success, msg = _controller.connect()
            print(json.dumps({"success": success, "message": msg}))
        
        elif cmd == "disconnect":
            _controller.disconnect()
            print(json.dumps({"success": True}))
        
        elif cmd == "screenshot":
            result = _controller.screenshot()
            print(json.dumps(result))
        
        elif cmd == "click" and len(sys.argv) == 4:
            result = _controller.click(sys.argv[2], sys.argv[3])
            print(json.dumps(result))
        
        elif cmd == "move" and len(sys.argv) == 4:
            result = _controller.move(sys.argv[2], sys.argv[3])
            print(json.dumps(result))
        
        elif cmd == "type" and len(sys.argv) >= 3:
            result = _controller.type(" ".join(sys.argv[2:]))
            print(json.dumps(result))
        
        elif cmd == "key" and len(sys.argv) == 3:
            keycode = int(sys.argv[2], 0)  # 支持 0x 前缀
            result = _controller.key(keycode)
            print(json.dumps(result))
        
        elif cmd == "double_click" and len(sys.argv) == 4:
            result = _controller.double_click(sys.argv[2], sys.argv[3])
            print(json.dumps(result))
        
        elif cmd == "drag" and len(sys.argv) == 6:
            result = _controller.drag(sys.argv[2], sys.argv[3], sys.argv[4], sys.argv[5])
            print(json.dumps(result))
        
        else:
            print(json.dumps({"error": f"未知命令: {cmd}"}))
    
    except Exception as e:
        print(json.dumps({"error": str(e)}))
