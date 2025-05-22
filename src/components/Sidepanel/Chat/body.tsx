import React from "react"
import { PlaygroundMessage } from "~/components/Common/Playground/Message"
import { useMessage } from "~/hooks/useMessage"
import { EmptySidePanel } from "../Chat/empty"
import { useWebUI } from "@/store/webui"
import { MessageSourcePopup } from "@/components/Common/Playground/MessageSourcePopup"

export const SidePanelBody = () => {
  const {
    messages,
    streaming,
    regenerateLastMessage,
    editMessage,
    isSearchingInternet
  } = useMessage()
  const divRef = React.useRef<HTMLDivElement>(null)
  const [isSourceOpen, setIsSourceOpen] = React.useState(false)
  const [source, setSource] = React.useState<any>(null)
  const { ttsEnabled } = useWebUI()

  const handlePrintMessages = () => {
    console.log("All messages:", messages);
    const id = Math.random().toString(36).substring(2, 10); // 生成随机 id
    const url = `http://192.168.31.221:3200/share_api/${id}`;
    let payload = messages.map((msg) => {
      return {
        role: msg.isBot ? "assistant" : "user",
        message: msg.message
      };
    });
    try {
      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      }).then(r => {
        if(r.status !== 200) {
          alert("上传数据失败")
        } else {
          navigator.clipboard.writeText(`http://192.168.31.221:3200/share/${id}`)
        }
      }).catch(e => {
        console.error(e)
        alert(e)
      });
    } catch (err) {
      alert(`上传失败: ${err.message}`);
    }
  }

  return (
    <>
      <div className="relative flex w-full flex-col items-center pt-16 pb-4">
        {messages.length === 0 && <EmptySidePanel />}
        {messages.map((message, index) => (
          <PlaygroundMessage
            key={index}
            isBot={message.isBot}
            message={message.message}
            name={message.name}
            images={message.images || []}
            currentMessageIndex={index}
            totalMessages={messages.length}
            onRengerate={regenerateLastMessage}
            message_type={message.messageType}
            isProcessing={streaming}
            isSearchingInternet={isSearchingInternet}
            sources={message.sources}
            onEditFormSubmit={(value) => {
              editMessage(index, value, !message.isBot)
            }}
            onSourceClick={(data) => {
              setSource(data)
              setIsSourceOpen(true)
            }}
            isTTSEnabled={ttsEnabled}
            generationInfo={message?.generationInfo}
            isStreaming={streaming}
            reasoningTimeTaken={message?.reasoning_time_taken}
            modelImage={message?.modelImage}
            modelName={message?.modelName}
          />
        ))}
        <div ref={divRef} />

        {/* 新增打印按钮 */}
        <button
          onClick={handlePrintMessages}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          上传消息
        </button>
      </div>

      <div className="w-full pb-[157px]"></div>

      <MessageSourcePopup
        open={isSourceOpen}
        setOpen={setIsSourceOpen}
        source={source}
      />
    </>
  )
}