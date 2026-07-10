import React, { useState, useEffect } from 'react';

export default function Academic({
  subjects,
  setSubjects,
  exams,
  setExams,
  gpas,
  setGpas,
  gradesStats,
  setGradesStats
}) {
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newSubjectCode, setNewSubjectCode] = useState('');
  const [newSubjectUnits, setNewSubjectUnits] = useState('');

  const [showExamModal, setShowExamModal] = useState(false);
  const [examSubject, setExamSubject] = useState('');
  const [examTitle, setExamTitle] = useState('');
  const [examDate, setExamDate] = useState('');
  const [examTime, setExamTime] = useState('');
  const [examLocation, setExamLocation] = useState('');

  const [editingGpaIndex, setEditingGpaIndex] = useState(null);
  const [editingGpaValue, setEditingGpaValue] = useState('');

  // Live countdown state
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, nextExamName: '' });

  useEffect(() => {
    const calculateCountdown = () => {
      if (exams.length === 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0, nextExamName: 'No upcoming exams' });
        return;
      }

      const upcoming = exams
        .map(ex => {
          const exDateTime = new Date(`${ex.date}T${ex.time || '09:00'}`);
          return { ...ex, dateTime: exDateTime };
        })
        .filter(ex => ex.dateTime > new Date())
        .sort((a, b) => a.dateTime - b.dateTime);

      if (upcoming.length === 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0, nextExamName: 'All exams completed' });
        return;
      }

      const nextEx = upcoming[0];
      const diff = nextEx.dateTime - new Date();

      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);

      setCountdown({
        days: d,
        hours: h,
        minutes: m,
        seconds: s,
        nextExamName: `${nextEx.subject} - ${nextEx.title}`
      });
    };

    calculateCountdown();
    const interval = setInterval(calculateCountdown, 1000);
    return () => clearInterval(interval);
  }, [exams]);

  // Subject operations
  const handleAddSubject = (e) => {
    e.preventDefault();
    if (!newSubjectName.trim()) return;

    const unitsArray = newSubjectUnits
      .split(',')
      .map(u => u.trim())
      .filter(u => u.length > 0)
      .map((name, index) => ({
        id: `unit-${Date.now()}-${index}`,
        name,
        completed: false
      }));

    const newSubject = {
      id: Date.now().toString(),
      name: newSubjectName.trim(),
      code: newSubjectCode.trim() || 'SUBJ',
      status: 'ON TRACK',
      units: unitsArray
    };

    setSubjects([...subjects, newSubject]);
    setShowSubjectModal(false);
    setNewSubjectName('');
    setNewSubjectCode('');
    setNewSubjectUnits('');
  };

  const toggleUnitCompleted = (subjectId, unitId) => {
    setSubjects(subjects.map(subj => {
      if (subj.id === subjectId) {
        const updatedUnits = subj.units.map(unit =>
          unit.id === unitId ? { ...unit, completed: !unit.completed } : unit
        );
        const completedCount = updatedUnits.filter(u => u.completed).length;
        const totalCount = updatedUnits.length;
        const completionPct = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
        let status = 'ON TRACK';
        if (completionPct === 100) status = 'COMPLETED';
        else if (completionPct < 25) status = 'BEHIND';

        return { ...subj, units: updatedUnits, status };
      }
      return subj;
    }));
  };

  const deleteSubject = (id) => {
    if (confirm('Delete this subject and all its syllabus tracking?')) {
      setSubjects(subjects.filter(s => s.id !== id));
    }
  };

  // Exam operations
  const handleAddExam = (e) => {
    e.preventDefault();
    if (!examSubject.trim() || !examTitle.trim() || !examDate) return;

    const newExam = {
      id: Date.now().toString(),
      subject: examSubject.trim(),
      title: examTitle.trim(),
      date: examDate,
      time: examTime || '09:00',
      location: examLocation.trim() || 'Exam Hall'
    };

    setExams([...exams, newExam]);
    setShowExamModal(false);
    setExamSubject('');
    setExamTitle('');
    setExamDate('');
    setExamTime('');
    setExamLocation('');
  };

  const deleteExam = (id) => {
    if (confirm('Delete this exam?')) {
      setExams(exams.filter(e => e.id !== id));
    }
  };

  // Result tracker operations
  const startEditGpa = (index) => {
    setEditingGpaIndex(index);
    setEditingGpaValue(gpas[index].val.toString());
  };

  const saveGpa = () => {
    const val = parseFloat(editingGpaValue);
    if (isNaN(val) || val < 0 || val > 4.0) {
      alert('Please enter a valid GPA between 0.0 and 4.0');
      return;
    }
    const updatedGpas = [...gpas];
    updatedGpas[editingGpaIndex] = { ...updatedGpas[editingGpaIndex], val };
    setGpas(updatedGpas);
    setEditingGpaIndex(null);
  };

  const changeGradeStat = (grade, increment) => {
    setGradesStats({
      ...gradesStats,
      [grade]: Math.max(0, gradesStats[grade] + (increment ? 1 : -1))
    });
  };

  // Calculate Cumulative GPA
  const calcCumulativeGpa = () => {
    const activeGpas = gpas.filter(g => g.val > 0);
    if (activeGpas.length === 0) return '0.00';
    const sum = activeGpas.reduce((acc, curr) => acc + curr.val, 0);
    return (sum / activeGpas.length).toFixed(2);
  };

  return (
    <div className="space-y-lg animate-fade-in">
      {/* Overview */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
        <div className="md:col-span-8 space-y-sm">
          <p className="font-label-caps text-label-caps text-primary tracking-widest">ACADEMIC HUB</p>
          <h2 className="text-headline-lg font-bold text-on-surface">Academic Velocity</h2>
          <p className="text-on-surface-variant max-w-xl text-body-lg">
            Track syllabus progress, manage exams, and view semester performance.
          </p>
        </div>
        <div className="md:col-span-4 flex items-end justify-end">
          <div className="glass-card p-md rounded-xl flex items-center gap-md w-full shimmer-card">
            <div className="flex-1">
              <p className="font-label-caps text-label-caps text-on-surface-variant text-[11px]">CUMULATIVE GPA</p>
              <p className="text-headline-lg font-extrabold text-primary transition-all duration-300">{calcCumulativeGpa()}</p>
            </div>
            <div className="w-16 h-16 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center">
              <span className="font-bold text-primary text-xl">A</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        {/* Syllabus Tracker */}
        <section className="lg:col-span-8 space-y-md">
          <div className="flex items-center justify-between">
            <h3 className="text-headline-md font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">menu_book</span>
              Syllabus Tracker
            </h3>
            <button
              onClick={() => setShowSubjectModal(true)}
              className="text-primary font-label-caps text-label-caps hover:underline font-bold"
            >
              + ADD SUBJECT
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
            {subjects.length === 0 ? (
              <div className="col-span-2 glass-card p-lg text-center rounded-xl italic text-on-surface-variant">
                No subjects configured. Set up one above!
              </div>
            ) : (
              subjects.map(subj => {
                const totalUnits = subj.units.length;
                const completedUnits = subj.units.filter(u => u.completed).length;
                const pct = totalUnits > 0 ? Math.round((completedUnits / totalUnits) * 100) : 0;

                return (
                  <div key={subj.id} className="glass-card rounded-xl p-md border-t-4 border-primary hover:-translate-y-1 transition-all duration-300 relative group">
                    <div className="flex justify-between items-start mb-sm">
                      <span className="font-mono text-[11px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                        {subj.code}
                      </span>
                      <span className={`font-label-caps text-[10px] px-2 py-0.5 rounded-full font-bold transition-all ${subj.status === 'COMPLETED' ? 'bg-secondary/15 text-secondary' : subj.status === 'BEHIND' ? 'bg-error/15 text-error' : 'bg-secondary-container/20 text-on-secondary-container'}`}>
                        {subj.status}
                      </span>
                    </div>

                    <h4 className="font-bold text-body-lg text-on-surface mb-2">{subj.name}</h4>

                    {/* Progress details */}
                    <div className="space-y-xs mb-sm">
                      <div className="flex justify-between font-label-caps text-[10px] font-bold text-on-surface-variant">
                        <span>COMPLETION</span>
                        <span>{pct}% ({completedUnits}/{totalUnits})</span>
                      </div>
                      <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-500 ease-out ${pct === 100 ? 'bg-secondary' : 'bg-primary'}`} style={{ width: `${pct}%` }}></div>
                      </div>
                    </div>

                    {/* Collapsible Unit Checkboxes */}
                    <div className="space-y-1.5 pt-2 border-t border-outline/10 max-h-36 overflow-y-auto scroll-hide">
                      {subj.units.map(unit => (
                        <label key={unit.id} className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={unit.completed}
                            onChange={() => toggleUnitCompleted(subj.id, unit.id)}
                            className="rounded border-outline/30 text-primary focus:ring-primary/20"
                          />
                          <span className={`text-[13px] font-medium leading-snug transition-colors ${unit.completed ? 'line-through text-on-surface-variant opacity-60' : 'text-on-surface'}`}>
                            {unit.name}
                          </span>
                        </label>
                      ))}
                    </div>

                    {/* Delete subject option */}
                    <button
                      onClick={() => deleteSubject(subj.id)}
                      className="absolute top-2 right-2 p-1 text-on-surface-variant hover:text-error opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </section>

        {/* Exam Countdown & List */}
        <aside className="lg:col-span-4 space-y-md">
          <div className="flex justify-between items-center">
            <h3 className="text-headline-md font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-tertiary">alarm</span>
              Exam Countdown
            </h3>
            <button
              onClick={() => setShowExamModal(true)}
              className="text-tertiary font-label-caps text-label-caps hover:underline font-bold"
            >
              + ADD EXAM
            </button>
          </div>

          <div className="space-y-md">
            {/* Live Count Box with float animation */}
            <div className="bg-gradient-to-br from-tertiary-container to-tertiary p-md text-on-tertiary-container rounded-xl shadow-lg relative overflow-hidden animate-float">
              <div className="absolute -right-4 -top-4 opacity-20 transform rotate-12">
                <span className="material-symbols-outlined !text-7xl">timer</span>
              </div>
              <p className="font-label-caps text-[10px] font-bold opacity-80 mb-xs text-white/90">NEXT EXAM COUNTDOWN</p>
              <h5 className="font-bold text-[14px] leading-tight truncate mb-md text-white">{countdown.nextExamName}</h5>

              {exams.length > 0 && countdown.nextExamName !== 'All exams completed' ? (
                <div className="flex justify-between text-center">
                  <div className="flex flex-col bg-black/15 px-2 py-1.5 rounded-lg flex-1 mx-0.5">
                    <span className="text-[20px] font-mono font-bold text-white">{countdown.days.toString().padStart(2, '0')}</span>
                    <span className="text-[9px] font-bold opacity-75 text-white/90">DAYS</span>
                  </div>
                  <div className="flex flex-col bg-black/15 px-2 py-1.5 rounded-lg flex-1 mx-0.5">
                    <span className="text-[20px] font-mono font-bold text-white">{countdown.hours.toString().padStart(2, '0')}</span>
                    <span className="text-[9px] font-bold opacity-75 text-white/90">HOURS</span>
                  </div>
                  <div className="flex flex-col bg-black/15 px-2 py-1.5 rounded-lg flex-1 mx-0.5">
                    <span className="text-[20px] font-mono font-bold text-white">{countdown.minutes.toString().padStart(2, '0')}</span>
                    <span className="text-[9px] font-bold opacity-75 text-white/90">MINS</span>
                  </div>
                  <div className="flex flex-col bg-black/15 px-2 py-1.5 rounded-lg flex-1 mx-0.5">
                    <span className="text-[20px] font-mono font-bold text-white" id="seconds-countdown">{countdown.seconds.toString().padStart(2, '0')}</span>
                    <span className="text-[9px] font-bold opacity-75 text-white/90">SECS</span>
                  </div>
                </div>
              ) : (
                <p className="text-center font-bold italic text-white/80 py-2">No exams scheduled.</p>
              )}
            </div>

            {/* Exam List Details */}
            <div className="glass-card rounded-xl p-md space-y-md max-h-[300px] overflow-y-auto scroll-hide">
              {exams.length === 0 ? (
                <p className="text-center text-on-surface-variant italic text-sm py-4">No scheduled exams.</p>
              ) : (
                exams.map(exam => {
                  const isPast = new Date(`${exam.date}T${exam.time}`) < new Date();
                  return (
                    <div key={exam.id} className={`flex items-start justify-between group p-1 rounded hover:bg-surface-container/30 transition-colors ${isPast ? 'opacity-50' : ''}`}>
                      <div className="flex items-center gap-sm">
                        <div className="w-2 h-10 bg-primary rounded-full"></div>
                        <div>
                          <h5 className="font-bold text-sm text-on-surface">{exam.subject} - {exam.title}</h5>
                          <p className="text-[11px] text-on-surface-variant font-medium">
                            {new Date(exam.date).toLocaleDateString([], { month: 'short', day: 'numeric' })} at {exam.time} · {exam.location}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => deleteExam(exam.id)}
                        className="text-on-surface-variant hover:text-error opacity-0 group-hover:opacity-100 transition-opacity p-1"
                      >
                        <span className="material-symbols-outlined text-[16px]">close</span>
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </aside>
      </div>

      {/* Result Tracker */}
      <section className="space-y-md">
        <h3 className="text-headline-md font-bold flex items-center gap-2">
          <span className="material-symbols-outlined text-secondary">trending_up</span>
          Result & GPA Tracker
        </h3>

        <div className="glass-card rounded-2xl p-lg grid grid-cols-1 md:grid-cols-12 gap-lg shimmer-card">
          {/* Grade Counter Cards */}
          <div className="md:col-span-4 space-y-md">
            <p className="font-label-caps text-label-caps text-on-surface-variant text-[11px]">SEMESTER PERFORMANCE COUNTERS</p>
            <div className="grid grid-cols-3 gap-sm">
              {Object.keys(gradesStats).map(grade => (
                <div key={grade} className="bg-surface-container/60 dark:bg-surface-container-high/20 p-sm rounded-lg flex flex-col items-center justify-center relative group hover:bg-surface-container transition-colors">
                  <span className="text-[11px] text-on-surface-variant font-bold mb-xs">{grade}'s</span>
                  <span className="font-extrabold text-primary text-xl">{gradesStats[grade]}</span>
                  
                  {/* Plus/minus buttons */}
                  <div className="flex gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => changeGradeStat(grade, false)}
                      className="w-5 h-5 bg-surface dark:bg-surface-container-high rounded flex items-center justify-center hover:bg-surface-container-high active:scale-90 text-[10px]"
                    >
                      -
                    </button>
                    <button
                      onClick={() => changeGradeStat(grade, true)}
                      className="w-5 h-5 bg-surface dark:bg-surface-container-high rounded flex items-center justify-center hover:bg-surface-container-high active:scale-90 text-[10px]"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* GPA Trends Visual Bar Chart */}
          <div className="md:col-span-8 space-y-md">
            <div className="flex justify-between items-end h-36 gap-md pb-xs border-b border-outline/10">
              {gpas.map((g, index) => {
                const maxGpa = 4.0;
                const barHeight = Math.max(8, Math.min(100, Math.round((g.val / maxGpa) * 100)));
                const isEditing = editingGpaIndex === index;

                return (
                  <div key={g.sem} className="flex-1 flex flex-col items-center gap-sm relative group cursor-pointer">
                    {/* Bar with smooth slide transition */}
                    <div
                      onClick={() => startEditGpa(index)}
                      className="w-full bg-primary/20 group-hover:bg-primary/35 rounded-t-lg transition-all duration-500 ease-out relative flex items-end justify-center"
                      style={{ height: `${barHeight}%` }}
                    >
                      <span className="text-[10px] font-bold text-primary mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {g.val.toFixed(2)}
                      </span>
                    </div>

                    <span className="font-label-caps text-[9px] text-on-surface-variant font-bold truncate max-w-full">
                      {g.sem}
                    </span>

                    {/* Popover editor */}
                    {isEditing && (
                      <div className="absolute bottom-12 z-20 bg-surface dark:bg-surface-container border border-outline/25 p-2 rounded-lg shadow-xl flex gap-1 items-center animate-spring-check">
                        <input
                          type="number"
                          min="0"
                          max="4.0"
                          step="0.01"
                          value={editingGpaValue}
                          onChange={(e) => setEditingGpaValue(e.target.value)}
                          className="w-14 px-1.5 py-1 text-xs border rounded bg-background focus:outline-none"
                        />
                        <button
                          onClick={saveGpa}
                          className="px-2 py-1 bg-primary text-on-primary text-[10px] font-bold rounded"
                        >
                          SAVE
                        </button>
                        <button
                          onClick={() => setEditingGpaIndex(null)}
                          className="px-1.5 py-1 bg-surface-container text-on-surface-variant text-[10px] rounded"
                        >
                          X
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            
            <div className="flex justify-between text-xs text-on-surface-variant font-medium">
              <span>* Click on any bar above to set/update its GPA.</span>
              <span className="flex items-center text-secondary font-bold gap-1">
                <span className="material-symbols-outlined text-sm">trending_up</span> 
                GPA trajectory: Active tracking
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Add Subject Modal */}
      {showSubjectModal && (
        <div className="fixed inset-0 bg-background/60 dark:bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-md animate-fade-in">
          <div className="glass-card w-full max-w-md rounded-2xl p-lg space-y-md shadow-2xl">
            <div className="flex justify-between items-center">
              <h3 className="font-headline-md text-headline-md text-primary flex items-center gap-2">
                <span className="material-symbols-outlined">library_add</span>
                Add New Subject
              </h3>
              <button
                onClick={() => setShowSubjectModal(false)}
                className="text-on-surface-variant hover:text-on-surface p-1"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleAddSubject} className="space-y-sm">
              <div>
                <label className="text-[12px] font-bold text-on-surface-variant block mb-1">SUBJECT NAME</label>
                <input
                  type="text"
                  placeholder="e.g. Advanced Calculus, World History..."
                  value={newSubjectName}
                  onChange={(e) => setNewSubjectName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-outline/30 bg-surface focus:outline-none focus:border-primary text-sm"
                  required
                />
              </div>

              <div>
                <label className="text-[12px] font-bold text-on-surface-variant block mb-1">COURSE CODE</label>
                <input
                  type="text"
                  placeholder="e.g. MATH301, HIST102..."
                  value={newSubjectCode}
                  onChange={(e) => setNewSubjectCode(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-outline/30 bg-surface focus:outline-none focus:border-primary text-sm"
                />
              </div>

              <div>
                <label className="text-[12px] font-bold text-on-surface-variant block mb-1">SYLLABUS UNITS (Comma separated)</label>
                <textarea
                  placeholder="e.g. Unit 1: Functions, Unit 2: Integration, Unit 3: Vector Math..."
                  value={newSubjectUnits}
                  onChange={(e) => setNewSubjectUnits(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-outline/30 bg-surface focus:outline-none focus:border-primary text-sm h-20 resize-none"
                  required
                />
                <span className="text-[10px] text-on-surface-variant font-medium">Split units with commas to create the syllabus checklist.</span>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSubjectModal(false)}
                  className="px-4 py-2 font-bold text-on-surface bg-surface-container hover:bg-surface-container-high rounded-xl text-sm"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-bold text-on-primary bg-primary hover:opacity-90 rounded-xl text-sm shadow-md shadow-primary/20"
                >
                  ADD SUBJECT
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Exam Modal */}
      {showExamModal && (
        <div className="fixed inset-0 bg-background/60 dark:bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-md animate-fade-in">
          <div className="glass-card w-full max-w-md rounded-2xl p-lg space-y-md shadow-2xl">
            <div className="flex justify-between items-center">
              <h3 className="font-headline-md text-headline-md text-tertiary flex items-center gap-2">
                <span className="material-symbols-outlined">edit_calendar</span>
                Add Scheduled Exam
              </h3>
              <button
                onClick={() => setShowExamModal(false)}
                className="text-on-surface-variant hover:text-on-surface p-1"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleAddExam} className="space-y-sm">
              <div className="grid grid-cols-2 gap-sm">
                <div>
                  <label className="text-[12px] font-bold text-on-surface-variant block mb-1">SUBJECT</label>
                  <input
                    type="text"
                    placeholder="e.g. Calculus, Physics..."
                    value={examSubject}
                    onChange={(e) => setExamSubject(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-outline/30 bg-surface focus:outline-none focus:border-tertiary text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="text-[12px] font-bold text-on-surface-variant block mb-1">EXAM TYPE/TITLE</label>
                  <input
                    type="text"
                    placeholder="e.g. Midterm, Lab Final..."
                    value={examTitle}
                    onChange={(e) => setExamTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-outline/30 bg-surface focus:outline-none focus:border-tertiary text-sm"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-sm">
                <div>
                  <label className="text-[12px] font-bold text-on-surface-variant block mb-1">EXAM DATE</label>
                  <input
                    type="date"
                    value={examDate}
                    onChange={(e) => setExamDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-outline/30 bg-surface focus:outline-none focus:border-tertiary text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="text-[12px] font-bold text-on-surface-variant block mb-1">TIME</label>
                  <input
                    type="time"
                    value={examTime}
                    onChange={(e) => setExamTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-outline/30 bg-surface focus:outline-none focus:border-tertiary text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-[12px] font-bold text-on-surface-variant block mb-1">LOCATION / HALL</label>
                <input
                  type="text"
                  placeholder="e.g. Exam Hall B, Room 402..."
                  value={examLocation}
                  onChange={(e) => setExamLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-outline/30 bg-surface focus:outline-none focus:border-tertiary text-sm"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowExamModal(false)}
                  className="px-4 py-2 font-bold text-on-surface bg-surface-container hover:bg-surface-container-high rounded-xl text-sm"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-bold text-on-primary bg-tertiary hover:opacity-90 rounded-xl text-sm shadow-md shadow-tertiary/20"
                >
                  ADD EXAM
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
