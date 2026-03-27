import { useEffect, useMemo, useRef, useState } from 'react';
import { APP_VERSION, DEFAULT_FORM, DEFAULT_NOZZLE, MATERIALS, NOZZLE_SIZES } from './constants';
import { Field, NumberField } from './components/Field';
import { Icon } from './components/Icon';
import { PreviewPanel } from './components/PreviewPanel';
import { ReportView } from './components/ReportView';
import { calculateApproxVolume, calculateGeometry } from './lib/calculations';
import { validateForm } from './lib/validation';
import type { CalculatorForm, NozzleForm } from './types';

const createNozzleId = () => globalThis.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2, 11);

function App() {
  const [form, setForm] = useState<CalculatorForm>(DEFAULT_FORM);
  const [nozzles, setNozzles] = useState<NozzleForm[]>([]);
  const [showReport, setShowReport] = useState(false);
  const printTriggeredRef = useRef(false);

  const validation = useMemo(() => validateForm(form, nozzles), [form, nozzles]);
  const calculated = useMemo(
    () => (validation.config ? calculateGeometry(validation.config) : null),
    [validation.config],
  );
  const volumeM3 = useMemo(
    () => (validation.config && calculated ? calculateApproxVolume(validation.config, calculated.totalHeight) : 0),
    [calculated, validation.config],
  );

  useEffect(() => {
    if (!showReport) {
      printTriggeredRef.current = false;
      return;
    }

    if (printTriggeredRef.current) return;
    printTriggeredRef.current = true;

    const timer = window.setTimeout(() => {
      try {
        window.print();
      } catch {
        // Browser print dialogs can be blocked by the user agent.
      }
    }, 120);

    return () => window.clearTimeout(timer);
  }, [showReport]);

  const configErrors = Object.values(validation.configErrors).filter(Boolean) as string[];
  const nozzleErrorEntries = nozzles
    .map((nozzle) => ({ id: nozzle.id, error: validation.nozzleErrors[nozzle.id] }))
    .filter((entry): entry is { id: string; error: string } => Boolean(entry.error));

  const updateForm = <K extends keyof CalculatorForm>(key: K, value: CalculatorForm[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const updateNozzle = (id: string, key: keyof NozzleForm, value: string) => {
    setNozzles((current) => current.map((nozzle) => (nozzle.id === id ? { ...nozzle, [key]: value } : nozzle)));
  };

  const addNozzle = () => {
    setNozzles((current) => [...current, { id: createNozzleId(), ...DEFAULT_NOZZLE }]);
  };

  const removeNozzle = (id: string) => {
    setNozzles((current) => current.filter((nozzle) => nozzle.id !== id));
  };

  const handleReportOpen = () => {
    if (!validation.isValid) return;
    setShowReport(true);
  };

  return (
    <>
      <div className={`app-shell ${showReport ? 'print-hidden' : ''}`}>
        <header className="app-header">
          <div className="brand">
            <div className="brand__badge">
              <Icon name="layers" size={22} />
            </div>
            <div>
              <h1>
                VesselHead<span>Config</span>
              </h1>
              <p>DIN 28011 / 28013 / SS 895 Calculator</p>
            </div>
          </div>

          <div className="header-actions">
            <div className="version-chip">v{APP_VERSION}</div>
            <button type="button" className="button button--primary" onClick={handleReportOpen} disabled={!validation.isValid}>
              <Icon name="download" size={18} />
              QC Report (PDF)
            </button>
          </div>
        </header>

        <main className="app-main">
          <aside className="sidebar">
            {(configErrors.length > 0 || nozzleErrorEntries.length > 0) && (
              <section className="card validation-card">
                <div className="section-title">
                  <Icon name="alert" size={18} />
                  <span>Validation</span>
                </div>
                <ul>
                  {configErrors.map((error) => (
                    <li key={error}>{error}</li>
                  ))}
                  {nozzleErrorEntries.map((entry) => (
                    <li key={entry.id}>{entry.error}</li>
                  ))}
                </ul>
              </section>
            )}

            <section className="card">
              <div className="section-title">
                <Icon name="ruler" size={18} />
                <span>Standard</span>
              </div>
              <div className="standard-grid">
                {(['DIN28011', 'DIN28013', 'SS895'] as const).map((standard) => (
                  <button
                    key={standard}
                    type="button"
                    className={`standard-pill ${form.standard === standard ? 'standard-pill--active' : ''}`}
                    onClick={() => updateForm('standard', standard)}
                  >
                    {standard}
                  </button>
                ))}
              </div>
            </section>

            <section className="card">
              <div className="section-title">
                <Icon name="settings" size={18} />
                <span>Geometry & Material</span>
              </div>

              <div className="form-grid">
                <NumberField
                  label="Diameter (Da)"
                  value={form.diameterOuter}
                  onChange={(event) => updateForm('diameterOuter', event.target.value)}
                  error={validation.configErrors.diameterOuter}
                  min={1}
                  suffix="mm"
                />
                <NumberField
                  label="Thickness (s)"
                  value={form.thickness}
                  onChange={(event) => updateForm('thickness', event.target.value)}
                  error={validation.configErrors.thickness}
                  min={0.1}
                  step={0.1}
                  suffix="mm"
                />
              </div>

              <Field label={`Straight Flange (h1): ${form.straightFlange} mm`} error={validation.configErrors.straightFlange}>
                <input
                  className="range-input"
                  type="range"
                  min="10"
                  max="150"
                  step="5"
                  value={form.straightFlange}
                  onChange={(event) => updateForm('straightFlange', event.target.value)}
                />
              </Field>

              <Field label="Material">
                <select className="input select" value={form.material} onChange={(event) => updateForm('material', event.target.value)}>
                  {MATERIALS.map((material) => (
                    <option key={material} value={material}>
                      {material}
                    </option>
                  ))}
                </select>
              </Field>
            </section>

            <section className="card">
              <div className="section-title">
                <Icon name="scissors" size={18} />
                <span>Weld Edge Prep</span>
              </div>

              <Field label="Type">
                <select className="input select" value={form.edgePrep} onChange={(event) => updateForm('edgePrep', event.target.value as CalculatorForm['edgePrep'])}>
                  <option value="None">None (Square Cut)</option>
                  <option value="V-Bevel">V-Bevel (Outside)</option>
                </select>
              </Field>

              {form.edgePrep !== 'None' ? (
                <div className="form-grid">
                  <NumberField
                    label="Angle"
                    value={form.bevelAngle}
                    onChange={(event) => updateForm('bevelAngle', event.target.value)}
                    error={validation.configErrors.bevelAngle}
                    min={1}
                    max={89}
                    suffix="deg"
                  />
                  <NumberField
                    label="Root Face"
                    value={form.rootFace}
                    onChange={(event) => updateForm('rootFace', event.target.value)}
                    error={validation.configErrors.rootFace}
                    min={0.1}
                    step={0.1}
                    suffix="mm"
                  />
                </div>
              ) : null}
            </section>

            <section className="card">
              <div className="section-title section-title--between">
                <span className="section-title__group">
                  <Icon name="cpu" size={18} />
                  <span>Nozzles</span>
                </span>
                <button type="button" className="icon-button" onClick={addNozzle} aria-label="Add nozzle">
                  <Icon name="plus" size={18} />
                </button>
              </div>

              <div className="nozzle-list">
                {nozzles.length === 0 && <p className="empty-state">No nozzles added yet.</p>}
                {nozzles.map((nozzle) => (
                  <div key={nozzle.id} className="nozzle-row">
                    <Field label="Size">
                      <select className="input select" value={nozzle.size} onChange={(event) => updateNozzle(nozzle.id, 'size', event.target.value)}>
                        {NOZZLE_SIZES.map((size) => (
                          <option key={size} value={size}>
                            {size}
                          </option>
                        ))}
                      </select>
                    </Field>
                    <NumberField
                      label="Offset"
                      value={nozzle.offset}
                      onChange={(event) => updateNozzle(nozzle.id, 'offset', event.target.value)}
                      error={validation.nozzleErrors[nozzle.id]}
                      step={1}
                      suffix="mm"
                    />
                    <button type="button" className="icon-button icon-button--danger" onClick={() => removeNozzle(nozzle.id)} aria-label="Remove nozzle">
                      <Icon name="trash-2" size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {validation.config && calculated && (
              <section className="card">
                <div className="section-title">
                  <Icon name="info" size={18} />
                  <span>Derived Data</span>
                </div>
                <dl className="derived-grid">
                  <div>
                    <dt>Crown radius R</dt>
                    <dd>{calculated.R.toFixed(1)} mm</dd>
                  </div>
                  <div>
                    <dt>Knuckle radius r</dt>
                    <dd>{calculated.r.toFixed(1)} mm</dd>
                  </div>
                  <div>
                    <dt>Dish depth h2</dt>
                    <dd>{calculated.h2.toFixed(1)} mm</dd>
                  </div>
                  <div>
                    <dt>Total height H</dt>
                    <dd>{calculated.totalHeight.toFixed(1)} mm</dd>
                  </div>
                  <div>
                    <dt>Da tolerance</dt>
                    <dd>
                      +{calculated.tolerances.daPlus} / -{calculated.tolerances.daMinus}
                    </dd>
                  </div>
                  <div>
                    <dt>Ovality max</dt>
                    <dd>{calculated.tolerances.ovality} mm</dd>
                  </div>
                </dl>
              </section>
            )}
          </aside>

          <section className="content">
            {validation.config && calculated ? (
              <PreviewPanel config={validation.config} calculated={calculated} nozzles={validation.nozzles} volumeM3={volumeM3} />
            ) : (
              <section className="card empty-preview">
                <Icon name="alert" size={28} />
                <h2>Preview paused</h2>
                <p>Fix the validation issues on the left to restore the engineering view and report generation.</p>
              </section>
            )}
          </section>
        </main>
      </div>

      {validation.config && calculated && (
        <ReportView
          config={validation.config}
          calculated={calculated}
          nozzles={validation.nozzles}
          isOpen={showReport}
          onClose={() => setShowReport(false)}
        />
      )}
    </>
  );
}

export default App;
