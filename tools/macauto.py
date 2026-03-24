#!/usr/bin/env python3
"""
Mac 自动化工具 - 整合版
支持：中文输入、鼠标控制、应用操作
"""
import os
import sys
import subprocess
import time

# 安装依赖
def install_deps():
    deps = ['pyperclip', 'pyautogui']
    for dep in deps:
        try:
            __import__(dep.replace('-', '_'))
        except ImportError:
            subprocess.run([sys.executable, '-m', 'pip', 'install', dep], check=False)

install_deps()

import pyautogui
import pyperclip
import json

class MacAutomation:
    def __init__(self):
        self.screen_size = pyautogui.size()
        print(f"屏幕尺寸: {self.screen_size}")
    
    def click(self, x, y):
        pyautogui.click(int(x), int(y))
        return {"success": True, "action": "click", "x": x, "y": y}
    
    def type_text(self, text):
        pyperclip.copy(text)
        time.sleep(0.1)
        pyautogui.hotkey('command', 'v')
        return {"success": True, "action": "type", "text": text}
    
    def press_key(self, key):
        pyautogui.press(key)
        return {"success": True, "action": "press", "key": key}
    
    def activate_app(self, app_name):
        subprocess.run(['osascript', '-e', f'tell application "{app_name}" to activate'])
        time.sleep(0.5)
        return {"success": True, "action": "activate", "app": app_name}
    
    def wechat_send(self, contact, message):
        # 激活微信
        subprocess.run(['osascript', '-e', 'tell application "WeChat" to activate'])
        time.sleep(0.8)
        
        # 点击搜索框
        pyautogui.click(350, 100)
        time.sleep(0.3)
        
        # 搜索联系人
        pyperclip.copy(contact)
        pyautogui.hotkey('command', 'v')
        time.sleep(0.5)
        pyautogui.press('return')
        time.sleep(0.8)
        
        # 点击第一个结果
        pyautogui.click(350, 220)
        time.sleep(0.5)
        
        # 点击输入框
        pyautogui.click(800, 950)
        time.sleep(0.3)
        
        # 输入消息
        pyperclip.copy(message)
        pyautogui.hotkey('command', 'v')
        time.sleep(0.2)
        
        # 发送
        pyautogui.press('return')
        
        return {"success": True, "contact": contact, "message": message}

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("用法: macauto.py <command> [args]")
        sys.exit(1)
    
    ctrl = MacAutomation()
    cmd = sys.argv[1]
    
    try:
        if cmd == "click" and len(sys.argv) >= 4:
            print(json.dumps(ctrl.click(sys.argv[2], sys.argv[3])))
        elif cmd == "type" and len(sys.argv) >= 3:
            print(json.dumps(ctrl.type_text(" ".join(sys.argv[2:]))))
        elif cmd == "press" and len(sys.argv) >= 3:
            print(json.dumps(ctrl.press_key(sys.argv[2])))
        elif cmd == "activate" and len(sys.argv) >= 3:
            print(json.dumps(ctrl.activate_app(sys.argv[2])))
        elif cmd == "wechat" and len(sys.argv) >= 4:
            print(json.dumps(ctrl.wechat_send(sys.argv[2], sys.argv[3])))
        else:
            print(json.dumps({"error": "未知命令"}))
    except Exception as e:
        print(json.dumps({"error": str(e)}))
