#!/usr/bin/env python3
"""
OpenClaw 工具：控制 Mac 屏幕
需要先设置环境: source ~/mcp-remote-macos-use/.venv/bin/activate
"""
import os
import sys
import json

# 添加 vnc_client 路径
sys.path.insert(0, os.path.expanduser('~/mcp-remote-macos-use/src'))
import vnc_client

# 配置
MACOS_HOST = os.environ.get('MACOS_HOST', 'localhost')
MACOS_USERNAME = os.environ.get('MACOS_USERNAME', 'Ymir')
MACOS_PASSWORD = os.environ.get('MACOS_PASSWORD', '1314')

def get_client():
    return vnc_client.VNCClient(
        host=MACOS_HOST,
        port=5900,
        username=MACOS_USERNAME,
        password=MACOS_PASSWORD
    )

def cmd_screenshot():
    client = get_client()
    success, msg = client.connect()
    if not success:
        print(json.dumps({"error": f"连接失败: {msg}"}))
        return
    
    screenshot = client.capture_screen()
    client.close()
    
    if screenshot:
        # 保存到文件
        path = "/tmp/mac_screenshot.png"
        with open(path, "wb") as f:
            f.write(screenshot)
        print(json.dumps({"success": True, "path": path, "size": len(screenshot)}))
    else:
        print(json.dumps({"error": "无法获取截图"}))

def cmd_click(x, y):
    client = get_client()
    success, msg = client.connect()
    if not success:
        print(json.dumps({"error": f"连接失败: {msg}"}))
        return
    
    client.send_mouse_click(int(x), int(y), button=1)
    client.close()
    print(json.dumps({"success": True, "action": "click", "x": x, "y": y}))

def cmd_move(x, y):
    client = get_client()
    success, msg = client.connect()
    if not success:
        print(json.dumps({"error": f"连接失败: {msg}"}))
        return
    
    client.send_pointer_event(int(x), int(y), 0)
    client.close()
    print(json.dumps({"success": True, "action": "move", "x": x, "y": y}))

def cmd_type(text):
    client = get_client()
    success, msg = client.connect()
    if not success:
        print(json.dumps({"error": f"连接失败: {msg}"}))
        return
    
    client.send_text(text)
    client.close()
    print(json.dumps({"success": True, "action": "type", "text": text}))

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("用法: mac_control.py <command> [args]")
        sys.exit(1)
    
    cmd = sys.argv[1]
    
    if cmd == "screenshot":
        cmd_screenshot()
    elif cmd == "click" and len(sys.argv) == 4:
        cmd_click(sys.argv[2], sys.argv[3])
    elif cmd == "move" and len(sys.argv) == 4:
        cmd_move(sys.argv[2], sys.argv[3])
    elif cmd == "type" and len(sys.argv) >= 3:
        cmd_type(" ".join(sys.argv[2:]))
    else:
        print(json.dumps({"error": "未知命令"}))
