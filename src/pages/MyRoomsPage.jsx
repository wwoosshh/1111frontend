// frontend/src/pages/MyRoomsPage.jsx
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../lib/api.js';
import PageShell from '../components/PageShell.jsx';

const inviteLink = (roomId) =>
  typeof window === 'undefined'
    ? `/room/${roomId}/join`
    : `${window.location.origin}/room/${roomId}/join`;

export default function MyRoomsPage() {
  const nav = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [openMenu, setOpenMenu] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState('');

  const refresh = () => {
    setLoading(true);
    return api.get('/api/me/rooms')
      .then((res) => setRooms(res.data.rooms))
      .catch((e) => setErr(e.response?.data?.error?.message || '목록을 불러오지 못했습니다.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { refresh(); }, []);

  const flash = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 1500);
  };

  const copyLink = async (roomId) => {
    try {
      await navigator.clipboard.writeText(inviteLink(roomId));
      flash('링크가 복사되었습니다');
    } catch {
      flash('복사 실패 — 직접 선택해 복사하세요');
    }
  };

  const enterRoom = (roomId) => nav(`/room/${roomId}/profile`);

  const deleteRoom = async (roomId) => {
    if (!confirm('정말 이 방을 삭제하시겠어요? 모든 프로필과 선택이 함께 삭제됩니다.')) return;
    setBusy(true);
    try {
      await api.delete(`/api/rooms/${roomId}`);
      await refresh();
      flash('방이 삭제되었습니다');
    } catch (e) {
      flash(e.response?.data?.error?.message || '삭제 실패');
    } finally { setBusy(false); setOpenMenu(null); }
  };

  const changePassword = async (roomId) => {
    const pw = window.prompt('새 비밀번호 (숫자 4~8자리)');
    if (pw === null) return;
    if (!/^[0-9]{4,8}$/.test(pw)) {
      flash('숫자 4~8자리여야 합니다');
      return;
    }
    setBusy(true);
    try {
      await api.patch(`/api/rooms/${roomId}/password`, { password: pw });
      flash('비밀번호가 변경되었습니다');
    } catch (e) {
      flash(e.response?.data?.error?.message || '변경 실패');
    } finally { setBusy(false); setOpenMenu(null); }
  };

  const cancelConfirm = async (roomId) => {
    setBusy(true);
    try {
      await api.delete(`/api/rooms/${roomId}/confirm`);
      await refresh();
      flash('확정이 취소되었습니다');
    } catch (e) {
      flash(e.response?.data?.error?.message || '취소 실패');
    } finally { setBusy(false); setOpenMenu(null); }
  };

  return (
    <PageShell>
      <h2 className="text-center mb-3">마이페이지</h2>

      <div className="mb-2 text-xs text-brand-ink/70 px-1">방 목록</div>
      {loading && <p className="text-center text-xs text-brand-ink/60">불러오는 중...</p>}
      {!loading && rooms.length === 0 && (
        <p className="text-center text-xs text-brand-ink/60 py-3">아직 방이 없습니다. 아래 "방 만들기" 또는 "방 추가하기"를 사용하세요.</p>
      )}

      <ul className="divide-y divide-dashed divide-brand-accent/30 px-1">
        {rooms.map((r) => {
          const isOpen = openMenu === r.id;
          return (
            <li key={r.id} className="py-2">
              <button type="button"
                onClick={() => setOpenMenu(isOpen ? null : r.id)}
                className="w-full flex justify-between items-center text-left">
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded" style={{ background: r.theme || '#FCE4E4' }} />
                  <span>{r.name}</span>
                  {r.isOwner && <span className="text-[10px] text-brand-accent">방장</span>}
                </span>
                <span className="text-xs text-brand-ink/60">
                  {r.confirmed_date ? `확정 ${String(r.confirmed_date).slice(0, 10)}` : '진행 중'}
                </span>
              </button>
              {isOpen && (
                <div className="mt-2 flex flex-wrap gap-2">
                  <button disabled={busy} onClick={() => enterRoom(r.id)} className="text-xs px-3 py-1 bg-brand text-white rounded">방 들어가기</button>
                  <button disabled={busy} onClick={() => copyLink(r.id)} className="text-xs px-3 py-1 border border-brand text-brand rounded">방 링크 복사</button>
                  {r.isOwner && (
                    <>
                      <button disabled={busy} onClick={() => changePassword(r.id)} className="text-xs px-3 py-1 border border-brand text-brand rounded">비밀번호 변경</button>
                      <button disabled={busy} onClick={() => deleteRoom(r.id)} className="text-xs px-3 py-1 border border-red-500 text-red-600 rounded">방 삭제</button>
                      {r.confirmed_date && (
                        <button disabled={busy} onClick={() => cancelConfirm(r.id)} className="text-xs px-3 py-1 border border-brand-accent text-brand-accent rounded">확정 취소</button>
                      )}
                    </>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>

      <div className="mt-5 grid grid-cols-3 gap-2 px-1">
        <Link to="/room/new" className="text-xs text-center px-2 py-2 bg-brand text-white rounded">방 만들기</Link>
        <Link to="/room/add" className="text-xs text-center px-2 py-2 border border-brand text-brand rounded">방 추가하기</Link>
        <Link to="/settings" className="text-xs text-center px-2 py-2 border border-brand-accent text-brand-accent rounded">설정</Link>
      </div>

      {err && <p className="text-xs text-red-600 text-center mt-3">{err}</p>}
      {toast && <p className="text-xs text-center text-brand-ink/80 mt-3">{toast}</p>}
    </PageShell>
  );
}
