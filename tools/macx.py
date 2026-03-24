#!/usr/bin/env python3
"""
Mac 控制工具 - 整合版
VNC: 截图 (2880x1800)
PyUserInput: 鼠标/键盘 (1440x900)

坐标转换: VNC坐标 = PyUserInput坐标 * 2
"""
import os
import sys
import json
import time

# PyUserInput
try:
    from pymouse import PyMouse
    from pykeyboard import PyKeyboard
    HAS_PYMOUSE = True
except ImportError:
    HAS_PYMOUSE = False

# VNC (用于截图)
VNC_PATH = os.path.expanduser("~/mcp-remote-macos-use/src")
sys.path.insert(0, VNC_PATH)

class MacController:
    def __init__(self):
        self.mouse = PyMouse() if HAS_PYMOUSE else None
        self.keyboard = PyKeyboard() if HAS_PYMOUSE else None
        
        # PyUserInput 屏幕尺寸 (Retina 实际)
        self.pymouse_size = self.mouse.screen_size() if HAS_PYMOUSE else (1440, 900)
        
        # VNC 屏幕尺寸
        self.vnc_size = (2880, 1800)
        
        # 缩放比例
        self.scale = self.vnc_size[0] / self.pymouse_size[0]
        
        print(f"PyUserInput 尺寸: {self.pymouse_size}", file=sys.stderr)
        print(f"VNC 尺寸: {self.vnc_size}", file=sys.stderr)
        print(f"缩放比例: {self.scale}", file=sys.stderr)
    
    def vnc_to_pymouse(self, x, y):
        """VNC 坐标转 PyUserInput 坐标"""
        return int(x / self.scale), int(y / self.scale)
    
    def pymouse_to_vnc(self, x, y):
        """PyUserInput 坐标转 VNC 坐标"""
        return int(x * self.scale), int(y * self.scale)
    
    def screenshot_vnc(self):
        """使用 VNC 截图"""
        try:
            import vnc_client
            client = vnc_client.VNCClient(
                host='localhost', port=5900,
                username='Ymir', password='1314'
            )
            success, msg = client.connect()
            if not success:
                return {"error": f"VNC连接失败: {msg}"}
            
            screenshot = client.capture_screen()
            client.close()
            
            if screenshot:
                path = os.path.expanduser("~/Desktop/mac_screenshot.png")
                with open(path, "wb") as f:
                    f.write(screenshot)
                return {"success": True, "path": path, "size": len(screenshot)}
            return {"error": "截图失败"}
        except Exception as e:
            return {"error": str(e)}
    
    def click(self, x, y, coord_type="pymouse"):
        """点击坐标"""
        if not self.mouse:
            return {"error": "PyUserInput not available"}
        
        if coord_type == "vnc":
            x, y = self.vnc_to_pymouse(x, y)
        
        self.mouse.click(int(x), int(y))
        return {"success": True, "action": "click", "x": x, "y": y, "coord_type": coord_type}
    
    def move(self, x, y, coord_type="pymouse"):
        """移动鼠标"""
        if not self.mouse:
            return {"error": "PyUserInput not available"}
        
        if coord_type == "vnc":
            x, y = self.vnc_to_pymouse(x, y)
        
        self.mouse.move(int(x), int(y))
        return {"success": True, "action": "move", "x": x, "y": y}
    
    def type(self, text):
        """输入文字"""
        if not self.keyboard:
            return {"error": "PyKeyboard not available"}
        
        self.keyboard.type_string(text)
        return {"success": True, "action": "type", "text": text}
    
    def key(self, key):
        """发送按键"""
        if not self.keyboard:
            return {"error": "PyKeyboard not available"}
        
        self.keyboard.tap_key(key)
        return {"success": True, "action": "key", "key": key}

# CLI
if __name__ == "__main__":
    ctrl = MacController()
    
    if len(sys.argv) < 2:
        print("用法:")
        print("  macx.py size              # 显示屏幕尺寸")
        print("  macx.py screenshot        # VNC 截图")
        print("  macx.py click x y [vnc]  # 点击 (pymouse 坐标或 vnc 坐标)")
        print("  macx.py type text         # 输入文字")
        print("  macx.py key char         # 按键")
        sys.exit(1)
    
    cmd = sys.argv[1]
    
    try:
        if cmd == "size":
            print(json.dumps({
                "pymouse": ctrl.pymouse_size,
                "vnc": ctrl.vnc_size,
                "scale": ctrl.scale
            }, indent=2))
        
        elif cmd == "screenshot":
            print(json.dumps(ctrl.screenshot_vnc()))
        
        elif cmd == "click" and len(sys.argv) >= 4:
            coord_type = sys.argv[4] if len(sys.argv) > 4 else "pymouse"
            result = ctrl.click(sys.argv[2], sys.argv[3], coord_type)
            print(json.dumps(result))
        
        elif cmd == "move" and len(sys.argv) >= 4:
            coord_type = sys.argv[4] if len(sys.argv) > 4 else "pymouse"
            result = ctrl.move(sys.argv[2], sys.argv[3], coord_type)
            print(json.dumps(result))
        
        elif cmd == "type" and len(sys.argv) >= 3:
            result = ctrl.type(" ".join(sys.argv[2:]))
            print(json.dumps(result))
        
        elif cmd == "key" and len(sys.argv) >= 3:
            result = ctrl.key(sys.argv[2])
            print(json.dumps(result))
        
        else:
            print(json.dumps({"error": f"未知命令: {cmd}"}))
    
    except Exception as e:
        print(json.dumps({"error": str(e)}))
