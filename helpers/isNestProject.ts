export const isNestProject = async (project: string): Promise<boolean> => {
  const regex = /^nestjs/i;
  return regex.test(project);
};
