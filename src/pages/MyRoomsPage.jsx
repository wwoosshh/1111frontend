// frontend/src/pages/MyRoomsPage.jsx
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../lib/api.js';
import PageShell from '../components/PageShell.jsx';
import Button from '../components/ui/Button.jsx';
import Stamp from '../components/ui/Stamp.jsx';
import TicketDivider from '../components/ui/TicketDivider.jsx';
import PrintingLoader from '../components/ui/PrintingLoader.jsx';

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
    setTimeout(() => setToast(''), 1800);
  };

  const copyLink = async (roomId) => {
    try {
      await navigator.clipboard.writeText(inviteLink(roomId));
      flash('링크 복사 완료');
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
      <TicketDivider>MY ROOMS</TicketDivider>

      {loading && <PrintingLoader text="LOADING" />}
      {!loading && rooms.length === 0 && (
        <div className="text-center py-6 px-2">
          <p className="font-receipt text-[11px] text-ink-faint">아직 방이 없습니다.</p>
          <p className="font-body text-xs text-ink-soft mt-1">아래에서 새 방을 만들거나 친구방에 입장해보세요.</p>
        </div>
      )}

      <ul className="flex flex-col gap-3 mt-2">
        {rooms.map((r, idx) => {
          const isOpen = openMenu === r.id;
          return (
            <li
              key={r.id}
              className="animate-fade-up"
              style={{ animationDelay: `${idx * 60}ms` }}
            >
              <div
                className="relative border border-dashed border-ink-faint/50 rounded-sm bg-paper-deep/40"
                style={{ borderLeftColor: r.theme || 'var(--ink-faint)', borderLeftStyle: 'solid', borderLeftWidth: 4 }}
              >
                <button
                  type="button"
                  onClick={() => setOpenMenu(isOpen ? null : r.id)}
                  className="w-full px-3 py-2.5 text-left flex justify-between items-start gap-2"
                  aria-expanded={isOpen}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-body text-sm text-ink truncate">{r.name}</span>
                      {r.isOwner && <Stamp size="xs" rotate={-6}>OWNER</Stamp>}
                      {r.confirmed_date && (
                        <Stamp size="xs" rotate={6} color="var(--seal)">CONFIRMED</Stamp>
                      )}
                    </div>
                    <div className="font-receipt text-[10px] tracking-[0.2em] text-ink-faint mt-1 uppercase">
                      {r.confirmed_date
                        ? `DATE · ${String(r.confirmed_date).slice(0, 10)}`
                        : 'IN PROGRESS'}
                    </div>
                  </div>
                  <span className="font-receipt text-xs text-ink-faint mt-1">{isOpen ? '▾' : '▸'}</span>
                </button>
                {isOpen && (
                  <div
                    className="border-t border-dashed border-ink-faint/40 px-3 py-2 flex flex-wrap gap-2 animate-fade-up"
                  >
                    <Button disabled={busy} onClick={() => enterRoom(r.id)}>ENTER</Button>
                    <Button disabled={busy} variant="outline" onClick={() => copyLink(r.id)}>COPY LINK</Button>
                    {r.isOwner && (
                      <>
                        <Button disabled={busy} variant="outline" onClick={() => changePassword(r.id)}>NEW PW</Button>
                        <Button disabled={busy} variant="outline" onClick={() => deleteRoom(r.id)}>DELETE</Button>
                        {r.confirmed_date && (
                          <Button disabled={busy} variant="outline" onClick={() => cancelConfirm(r.id)}>UNCONFIRM</Button>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      <hr className="ticket-divider mt-5" />

      <div className="grid grid-cols-3 gap-2">
        <Button as={Link} to="/room/new" className="text-center">CREATE</Button>
        <Button as={Link} to="/room/add" variant="outline" className="text-center">JOIN</Button>
        <Button as={Link} to="/settings" variant="outline" className="text-center">SETTINGS</Button>
      </div>

      {err && <p className="font-receipt text-[11px] text-stamp text-center mt-3">{err}</p>}
      {toast && (
        <div className="fixed left-1/2 -translate-x-1/2 top-4 z-50 animate-fade-up">
          <div className="paper-surface shadow-paper border border-dashed border-ink-faint px-4 py-2 text-xs font-receipt text-ink"
               style={{ transform: 'rotate(-1.5deg)' }}>
            {toast}
          </div>
        </div>
      )}
    </PageShell>
  );
}
