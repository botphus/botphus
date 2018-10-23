import {Action, AnyAction, Middleware } from 'redux';

export interface IThunkDispatch<S, E, A extends Action> {
  <T extends A>(action: T): T;
  <R>(thunkAction: ThunkAction<R, S, E, A>): R;
}

export type ThunkAction<R, S, E, A extends Action> = (
  dispatch: IThunkDispatch<S, E, A>,
  getState: () => S,
  extraArgument: E
) => R;

export type ThunkMiddleware<S = {}, A extends Action = AnyAction, E = undefined> = Middleware<IThunkDispatch<S, E, A>, S, IThunkDispatch<S, E, A>>;

declare const thunk: ThunkMiddleware & {
  withExtraArgument<E>(extraArgument: E): ThunkMiddleware<{}, AnyAction, E>
};

export default thunk;
