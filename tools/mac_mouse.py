#!/usr/bin/env python3
"""
Mac 控制工具 - 结合 PyUserInput (精确鼠标) + VNC (截图)
"""
import os
import sys
import json
import time

# 尝试导入 PyUserInput
try:
    from pymouse import PyMouse
    from pykeyboard import PyKeyboard
    HAS_PYMOUSE = True
except ImportError:
    HAS_PYMOUSE = False

class MacController:
    def __init__(self):
        self.mouse = PyMouse() if HAS_PYMOUSE else None
        self.keyboard = PyKeyboard() if HAS_PYMOUSE else None
        self.screen_size = self.mouse.screen_size() if HAS_PYMOUSE else (1440, 900)
    
    def click(self, x, y):
        """点击坐标"""
        if not self.mouse:
            return {"error": "PyUserInput not available"}
        
        # PyUserInput 使用实际分辨率 (1440x900)
        self.mouse.click(int(x), int(y))
        return {"success": True, "action": "click", "x": x, "y": y}
    
    def move(self, x, y):
        """移动鼠标"""
        if not self.mouse:
            return {"error": "PyUserInput not available"}
        
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
    
    def screenshot(self):
        """截图 - 需要使用 VNC"""
        # 暂时返回说明
        return {"info": "Use VNC for screenshot, this is for mouse/keyboard only"}
    
    def screen_size_info(self):
        """返回屏幕尺寸信息"""
        return {
            "pymouse_size": self.screen_size,
            "note": "PyUserInput uses half resolution (1440x900) on Retina"
        }

# 测试
if __name__ == "__main__":
    ctrl = MacController()
    
    # 打印屏幕信息
    print(json.dumps(ctrl.screen_size_info(), indent=2))
    
    # 测试点击
    if len(sys.argv) > 1:
        cmd = sys.argv[1]
        
        if cmd == "click" and len(sys.argv) >= 4:
            result = ctrl.click(sys.argv[2], sys.argv[3])
            print(json.dumps(result))
        
        elif cmd == "move" and len(sys.argv) >= 4:
            result = ctrl.move(sys.argv[2], sys.argv[3])
            print(json.dumps(result))
        
        elif cmd == "type" and len(sys.argv) >= 3:
            result = ctrl.type(" ".join(sys.argv[2:]))
            print(json.dumps(result))
        
        elif cmd == "key" and len(sys.argv) >= 3:
            result = ctrl.key(sys.argv[2])
            print(json.dumps(result))
        
        elif cmd == "size":
            print(json.dumps(ctrl.screen_size_info(), indent=2))
