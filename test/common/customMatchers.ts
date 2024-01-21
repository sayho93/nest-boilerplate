declare module jest {
  interface Matchers<R> {
    toContainObject: (args: Record<string, any>) => R;
  }
}

function applyObjectContaining(obj: Record<string, any>) {
  for (const key in obj) {
    if (obj[key]?.constructor === Object) {
      obj[key] = expect.objectContaining(applyObjectContaining(obj[key]));
    }
  }
  return obj;
}

function toContainObject(recv: Record<string, any>, args: Record<string, any>) {
  applyObjectContaining(args);

  const pass = this.equals(recv, expect.arrayContaining([expect.objectContaining(args)]));

  return {
    pass,
    message: () => (pass ? '' : `expected ${JSON.stringify(recv)} to contain ${JSON.stringify(args)}`),
  };
}

expect.extend({ toContainObject });
