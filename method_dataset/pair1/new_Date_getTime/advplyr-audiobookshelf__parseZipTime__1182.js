function parseZipTime(timebytes, datebytes) {
  const timebits = toBits(timebytes, 16);
  const datebits = toBits(datebytes, 16);

  const mt = {
    h: parseInt(timebits.slice(0, 5).join(''), 2),
    m: parseInt(timebits.slice(5, 11).join(''), 2),
    s: parseInt(timebits.slice(11, 16).join(''), 2) * 2,
    Y: parseInt(datebits.slice(0, 7).join(''), 2) + 1980,
    M: parseInt(datebits.slice(7, 11).join(''), 2),
    D: parseInt(datebits.slice(11, 16).join(''), 2),
  };
  const dt_str = [mt.Y, mt.M, mt.D].join('-') + ' ' + [mt.h, mt.m, mt.s].join(':') + ' GMT+0';
  return new Date(dt_str).getTime();
}
