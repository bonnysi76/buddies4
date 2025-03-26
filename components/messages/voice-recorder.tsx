"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { cn } from "@/lib/utils"

interface VoiceRecorderProps {
  onComplete: (duration: number) => void
  onCancel: () => void
}

export function VoiceRecorder({ onComplete, onCancel }: VoiceRecorderProps) {
  const [recordingTime, setRecordingTime] = useState(0)
  const [isRecording, setIsRecording] = useState(true)
  const [amplitude, setAmplitude] = useState<number[]>(Array(20).fill(5))

  // Simulate recording time
  useEffect(() => {
    if (!isRecording) return

    const interval = setInterval(() => {
      setRecordingTime((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [isRecording])

  // Simulate audio waveform
  useEffect(() => {
    if (!isRecording) return

    const interval = setInterval(() => {
      setAmplitude((prev) => {
        const newAmplitude = [...prev]
        newAmplitude.shift()
        newAmplitude.push(Math.floor(Math.random() * 30) + 5)
        return newAmplitude
      })
    }, 150)

    return () => clearInterval(interval)
  }, [isRecording])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleStop = () => {
    setIsRecording(false)
    // Simulate processing
    setTimeout(() => {
      onComplete(recordingTime)
    }, 500)
  }

  return (
    <div className="flex items-center gap-3 p-2 bg-muted/30 rounded-lg border">
      <div className="flex items-center gap-2 flex-1">
        <div className={cn("h-3 w-3 rounded-full", isRecording ? "bg-red-500 animate-pulse" : "bg-muted-foreground")} />
        <span className="text-sm font-medium">{formatTime(recordingTime)}</span>

        <div className="flex-1 flex items-center justify-center gap-[2px] h-12">
          {amplitude.map((value, index) => (
            <div
              key={index}
              className="w-1 bg-primary rounded-full transition-all duration-150"
              style={{ height: `${value}px` }}
            />
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="destructive" size="icon" className="rounded-full h-10 w-10" onClick={onCancel}>
          <Icons.trash className="h-4 w-4" />
        </Button>
        <Button variant="default" size="icon" className="rounded-full h-10 w-10" onClick={handleStop}>
          <Icons.send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

