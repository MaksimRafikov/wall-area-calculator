import { Fragment } from "react";
import type { ProjectCalc } from "../types";

function fmt(n: number): string {
  return n.toLocaleString("ru-RU", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

interface ResultsTableProps {
  calc: ProjectCalc;
}

export function ResultsTable({ calc }: ResultsTableProps) {
  if (calc.rooms.length === 0) {
    return (
      <p className="hint">Добавьте помещения — таблица сметы появится здесь</p>
    );
  }

  return (
    <div className="results-stack">
      <div className="table-wrap">
        <h3 className="table-title">Стены по помещениям</h3>
        <p className="hint table-note">
          Общие перегородки учитываются в каждой смежной комнате — для сметы внутренней отделки.
        </p>
        <table className="estimate-table">
          <thead>
            <tr>
              <th>Помещение</th>
              <th>Стена</th>
              <th>Брутто, м²</th>
              <th>Вычет, м²</th>
              <th>Чистая, м²</th>
            </tr>
          </thead>
          <tbody>
            {calc.rooms.map((room) => (
              <Fragment key={room.room.id}>
                {room.walls.map((w) => (
                  <tr key={w.wall.id}>
                    <td>{room.room.name}</td>
                    <td>{w.wall.label || "—"}</td>
                    <td className="num">{fmt(w.grossM2)}</td>
                    <td className="num">{fmt(w.deductM2)}</td>
                    <td className="num">{fmt(w.netM2)}</td>
                  </tr>
                ))}
                <tr key={`${room.room.id}-walls`} className="row-subtotal">
                  <td colSpan={2}>
                    <strong>{room.room.name} — стены</strong>
                  </td>
                  <td className="num">
                    <strong>{fmt(room.grossM2)}</strong>
                  </td>
                  <td className="num">
                    <strong>{fmt(room.deductM2)}</strong>
                  </td>
                  <td className="num">
                    <strong>{fmt(room.netM2)}</strong>
                  </td>
                </tr>
              </Fragment>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={2}>
                <strong>Всего стен</strong>
              </td>
              <td className="num">
                <strong>{fmt(calc.totals.grossM2)}</strong>
              </td>
              <td className="num">
                <strong>{fmt(calc.totals.deductM2)}</strong>
              </td>
              <td className="num">
                <strong>{fmt(calc.totals.netM2)}</strong>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="table-wrap">
        <h3 className="table-title">Откосы по помещениям</h3>
        <p className="hint table-note">
          Периметр проёма × глубина откоса × кол-во. Окна и прочие проёмы (двери, арки) — отдельно.
        </p>
        <table className="estimate-table estimate-table--reveals">
          <thead>
            <tr>
              <th>Помещение</th>
              <th>Откосы окон, м²</th>
              <th>Откосы проёмов, м²</th>
              <th>Итого откосов, м²</th>
            </tr>
          </thead>
          <tbody>
            {calc.rooms.map((room) => (
              <tr key={`${room.room.id}-rev`}>
                <td>{room.room.name}</td>
                <td className="num">{fmt(room.windowRevealM2)}</td>
                <td className="num">{fmt(room.openingRevealM2)}</td>
                <td className="num">
                  <strong>{fmt(room.totalRevealM2)}</strong>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td>
                <strong>Всего откосов</strong>
              </td>
              <td className="num">
                <strong>{fmt(calc.totals.windowRevealM2)}</strong>
              </td>
              <td className="num">
                <strong>{fmt(calc.totals.openingRevealM2)}</strong>
              </td>
              <td className="num">
                <strong>{fmt(calc.totals.totalRevealM2)}</strong>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="table-wrap">
        <h3 className="table-title">Детализация откосов по стенам</h3>
        <table className="estimate-table estimate-table--reveals">
          <thead>
            <tr>
              <th>Помещение</th>
              <th>Стена</th>
              <th>Окна, м²</th>
              <th>Проёмы, м²</th>
              <th>Σ, м²</th>
            </tr>
          </thead>
          <tbody>
            {calc.rooms.map((room) =>
              room.walls
                .filter((w) => w.totalRevealM2 > 0)
                .map((w) => (
                  <tr key={`${w.wall.id}-rev`}>
                    <td>{room.room.name}</td>
                    <td>{w.wall.label || "—"}</td>
                    <td className="num">{fmt(w.windowRevealM2)}</td>
                    <td className="num">{fmt(w.openingRevealM2)}</td>
                    <td className="num">{fmt(w.totalRevealM2)}</td>
                  </tr>
                )),
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
