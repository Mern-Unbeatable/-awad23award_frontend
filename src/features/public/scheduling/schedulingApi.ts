import { SCHEDULING_ENDPOINTS } from '../../../services/endpoints/scheduling.endpoints';
import { http } from '../../../services/http';

export const getSchedulingRequest = () =>
  http.get(SCHEDULING_ENDPOINTS.PUBLIC);
