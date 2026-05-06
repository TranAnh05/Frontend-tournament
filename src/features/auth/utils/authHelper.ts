export const getHomeRoute = (roles: string[]): string => {
  if (roles.includes('ROLE_ADMIN')) return '/admin';
  if (roles.includes('ROLE_ORGANIZER')) return '/organizer';
  if (roles.includes('ROLE_CLUB')) return '/club';
  if (roles.includes('ROLE_REFEREE')) return '/referee';
  if (roles.includes('ROLE_ATHLETE')) return '/athlete';
  
  return '/unauthorized'; 
};