import React, { memo, useContext, useCallback, HTMLAttributes, forwardRef } from 'react';
import cc from 'classcat';

import { useStoreActions, useStoreState } from '../../store/hooks';
import NodeIdContext from '../../contexts/NodeIdContext';
import { HandleProps, Connection, ElementId, Position } from '../../types';

import { onMouseDown, SetSourceIdFunc, SetPosition } from './handler';

const alwaysValid = () => true;

export type HandleComponentProps = HandleProps & Omit<HTMLAttributes<HTMLDivElement>, 'id'>;

const Handle = forwardRef<HTMLDivElement, HandleComponentProps>(
  (
    {
      type = 'source',
      position = Position.Top,
      isValidConnection = alwaysValid,
      isConnectable = true,
      id,
      onConnect,
      children,
      className,
      ...rest
    },
    ref
  ) => {
    const nodeId = useContext(NodeIdContext) as ElementId;
    const setPosition = useStoreActions((actions) => actions.setConnectionPosition);
    const setConnectionNodeId = useStoreActions((actions) => actions.setConnectionNodeId);
    const onConnectAction = useStoreState((state) => state.present.onConnect);
    const onConnectStart = useStoreState((state) => state.present.onConnectStart);
    const onConnectStop = useStoreState((state) => state.present.onConnectStop);
    const onConnectEnd = useStoreState((state) => state.present.onConnectEnd);
    const connectionMode = useStoreState((state) => state.present.connectionMode);
    const handleId = id || null;
    const isTarget = type === 'target';

    const onConnectExtended = useCallback(
      (params: Connection) => {
        onConnectAction?.(params);
        onConnect?.(params);
      },
      [onConnectAction, onConnect]
    );

    const onMouseDownHandler = useCallback(
      (event: React.MouseEvent) => {
        onMouseDown(
          event,
          handleId,
          nodeId,
          setConnectionNodeId as unknown as SetSourceIdFunc,
          setPosition as unknown as SetPosition,
          onConnectExtended,
          isTarget,
          isValidConnection,
          connectionMode,
          undefined,
          undefined,
          onConnectStart,
          onConnectStop,
          onConnectEnd
        );
      },
      [
        handleId,
        nodeId,
        setConnectionNodeId,
        setPosition,
        onConnectExtended,
        isTarget,
        isValidConnection,
        connectionMode,
        onConnectStart,
        onConnectStop,
        onConnectEnd,
      ]
    );

    const handleClasses = cc([
      'react-flow__handle',
      `react-flow__handle-${position}`,
      'nodrag',
      className,
      {
        source: !isTarget,
        target: isTarget,
        connectable: isConnectable,
      },
    ]);

    return (
      <div
        data-handleid={handleId}
        data-nodeid={nodeId}
        data-handlepos={position}
        className={handleClasses}
        onMouseDown={onMouseDownHandler}
        ref={ref}
        {...rest}
      >
        {children}
      </div>
    );
  }
);

Handle.displayName = 'Handle';

export default memo(Handle);
