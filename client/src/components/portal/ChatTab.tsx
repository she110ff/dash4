import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '../../hooks/useAuth';
import { api } from '../../api/client';
import styles from './ChatTab.module.css';

interface Message {
  id: string;
  content: string;
  senderRole: string;
  createdAt: string;
  sender: { id: string; name: string; role: string };
}

export function ChatTab({ projectId }: { projectId: string }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [connected, setConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const seenIds = useRef(new Set<string>());

  // 히스토리 로드
  useEffect(() => {
    api.projects.messages(projectId).then((msgs) => {
      const reversed = [...msgs].reverse();
      reversed.forEach((m) => seenIds.current.add(m.id));
      setMessages(reversed);
    });
  }, [projectId]);

  // Socket.IO 연결
  useEffect(() => {
    const socket = io('/chat', { withCredentials: true });
    socketRef.current = socket;

    socket.on('connect', () => {
      setConnected(true);
      socket.emit('join', { projectId });
    });

    socket.on('disconnect', () => setConnected(false));

    socket.on('message', (msg: Message) => {
      // ID 기반 dedup (eng review 결정)
      if (seenIds.current.has(msg.id)) return;
      seenIds.current.add(msg.id);
      setMessages((prev) => [...prev, msg]);
    });

    return () => { socket.disconnect(); };
  }, [projectId]);

  // 새 메시지 시 스크롤
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim() || !socketRef.current) return;
    socketRef.current.emit('message', { projectId, content: input.trim() });
    setInput('');
  };

  return (
    <div className={styles.container}>
      <div className={styles.status}>
        <span className={`${styles.dot} ${connected ? styles.dotGreen : styles.dotRed}`} />
        {connected ? '연결됨' : '재연결 중...'}
      </div>

      <div className={styles.messages}>
        {messages.length === 0 ? (
          <div className={styles.empty}>먼저 인사해보세요.</div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`${styles.msg} ${msg.sender.id === user?.id ? styles.msgMine : styles.msgOther}`}
            >
              <span className={styles.sender}>{msg.sender.name}</span>
              <span className={styles.content}>{msg.content}</span>
              <span className={styles.time}>
                {new Date(msg.createdAt).toLocaleTimeString('ko-KR', {
                  hour: '2-digit', minute: '2-digit',
                })}
              </span>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      <div className={styles.inputArea}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="메시지를 입력하세요..."
          className={styles.input}
        />
        <button onClick={sendMessage} className={styles.sendBtn} disabled={!input.trim()}>
          전송
        </button>
      </div>
    </div>
  );
}
