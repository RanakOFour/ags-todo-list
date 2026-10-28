#!/usr/bin/env -S ags run
import app from "ags/gtk4/app"
import GLib from "gi://GLib"
import { Gdk } from "ags/gtk4"

import { g_monitor, g_styleConfig } from "@/globals"
import { MainWindow } from "@/mainwindow"
import { readFile } from "ags/file"
import { exec } from "ags/process"

function CompileSCSS(_path : string) : string | null {
  if (_path.endsWith(".css")) {
    return readFile(_path)          // already plain CSS
  }

  try {
    return exec(["sass", "--no-source-map", _path])
  } catch (e) {
    console.log("Failed to compile", _path, e)
    return null
  }
}

function CheckForStyle(_filePath : string) {
  console.log("Checking config path", _filePath, "for style")
  const css = CompileSCSS(_filePath)
  if(css == null) return false

  g_styleConfig.Set(css)
  return true
}

function SetDisplay(_index : number) : boolean {
  const display = Gdk.Display.get_default()
  if (!display) {
    console.log("No default display available")
    return false
  }

  const monitors = display.get_monitors()
  const count = monitors.get_n_items()

  if (!Number.isInteger(_index) || _index < 0 || _index >= count) {
    console.log(`Invalid display ${_index}, available displays: 0 to ${count - 1}`)
    return false
  }

  const monitor = monitors.get_item(_index) as Gdk.Monitor

  g_monitor.Set(monitor)

  console.log(`Using display ${_index}: ${monitor.get_connector()}`)
  return true
}

app.start({
  requestHandler(argv, response) {
    console.log("Requests:", argv)
    console.log("An instance of TodoWidget is already running!")
  },
  main(...argv: string[]) {
  var customStylePath = false
    argv.forEach(argument => {
      console.log("Argument passed:", argument)
      
      if(argument.includes("display=", 0)){
        const monitorNumber = Number(argument.slice("display=".length))
        if(!SetDisplay(monitorNumber)) {
          console.log("Using default monitor")
        }
      }
      else if(argument.includes("stylePath=")){
        const stylePath = argument.slice("stylePath=".length)
        CheckForStyle(stylePath)
        if(CheckForStyle(stylePath)){
          app.apply_css(g_styleConfig.Get()!, false)
          customStylePath = true
        }
      }
    });

    if(!g_monitor.Get()) SetDisplay(0)
    if(!customStylePath) {
      // Will overwrite g_styleConfig, else default
      if(CheckForStyle(GLib.build_filenamev([GLib.get_user_config_dir(), "TodoWidget/style.scss"])))
      {
        app.apply_css(g_styleConfig.Get()!, false)
      }
    }

    return MainWindow(g_monitor.Get()!)
  },
})