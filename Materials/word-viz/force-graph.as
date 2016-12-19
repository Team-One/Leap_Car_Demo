// forked from yonatan's Force-directed graph layout
package {
	import flash.display.Sprite;
	import flash.events.*;
	import flash.geom.*;
	import com.bit101.components.*;

	public class FlashTest extends Sprite {
		private var nodes:Array = [];

		private var draggingNode:Node;

		public function FlashTest() {
			function addNodes(parent:Node, recur:int):void {
				var cnt:int = 2 + Math.random() * 3;
				for(var i:int = 0; i < cnt; i++) {
					var node:Node = new Node;
					nodes.push(node);
					addChild(node);
					node.x = Math.random() * 465;
					node.y = Math.random() * 465;
					node.connect(parent);
					if(recur) {
						addNodes(node, recur-1);
					}
					node.addEventListener(MouseEvent.MOUSE_DOWN, function(e:Event):void { draggingNode = e.target as Node; } );
				}
			}

			function addRandomLinks(cnt:int):void {
				while(cnt--) {
					var a:Node = nodes[Math.random() * nodes.length | 0];
					var b:Node = nodes[Math.random() * nodes.length | 0];
					if(a != b) a.connect(b);
				}
			}

			function restart():void {
				graphics.clear();
				for each(var node:Node in nodes) removeChild(node);
				nodes = [];
				nodes[0] = addChild(new Node);
				nodes[0].x = 465/2;
				nodes[0].y = 465/3;
				addNodes(nodes[0], 1);
				addRandomLinks(5);
				nodes[0].buttonMode = false; // no dragging the root node!
			}

			restart();
			new PushButton(this, 5, 5, "Again", restart);

			addEventListener(Event.ENTER_FRAME, step);
			stage.addEventListener(MouseEvent.MOUSE_UP, function(e:*):void { draggingNode = null; });
		}

		private function step(e:Event):void {
			for(var j:int = 0; j < 5; j++) {
				// skip the root node, leave it at the center.
				for(var i:int = 1; i < nodes.length; i++) {
					if(nodes[i] == draggingNode) {
						nodes[i].x = mouseX;
						nodes[i].y = mouseY;
					} else {
						nodes[i].applyForce(nodes);
						nodes[i].vy += 800;
					}
				}
			}

			drawEdges(nodes);
		}

		private function drawEdges(nodes:Array):void {
			graphics.clear();
			graphics.lineStyle(2);
			
			for each(var node:Node in nodes) {
				for each(var other:Node in node.connectedNodes) {
					graphics.moveTo(node.x, node.y);
					graphics.lineTo(other.x, other.y);
				}
			}
		}
	}
}

import flash.display.Sprite;
import flash.events.*;
import flash.utils.Dictionary;

class Node extends Sprite {
	public var vx:Number = 0;
	public var vy:Number = 0;
	public var fx:Number = 0;
	public var fy:Number = 0;

	public const damping:Number = 0.01;
	public const timestep:Number = 0.2;

	public var connectedNodes:Dictionary;

	public function Node() {
		connectedNodes = new Dictionary(true);

		graphics.lineStyle(2);
		graphics.beginFill(0x808080 | (Math.random() * 0xFFFFFF));
		graphics.drawCircle(0, 0, 10);
		graphics.endFill();

		buttonMode = true;
	}

	public function connect(other:Node):void {
		connectedNodes[other] = other;
		other.connectedNodes[this] = this;
	}
	
	public function disconnect(other:Node):void {
		delete connectedNodes[other];
		delete other.connectedNodes[this];
	}
	
	// based on pseudocode from http://en.wikipedia.org/wiki/Force-based_algorithms_%28graph_drawing%29
	public function applyForce(allNodes:Array):void {
		var other:Node;

		fx = fy = 0;

		for each(other in allNodes) {
			if(other == this) continue;
			var repulsion:Object = computeRepulsion(other);
			fx += repulsion.x;
			fy += repulsion.y;
		}

		for each(other in connectedNodes) {
			var attraction:Object = computeAttraction(other);
			fx += attraction.x;
			fy += attraction.y;
		}

		vx = (vx + timestep * fx) * damping;
		vy = (vy + timestep * fy) * damping;

		x = x + timestep * vx;
		y = y + timestep * vy;
		
	}

	public function computeAttraction(other:Node):Object {
		var k:Number = 500;
		var idealDistance:Number = 15;
		var dist:Number = distance(other);
		var f:Number = - k * (dist - idealDistance);
		var c:Number = f / dist;
		return({x: c * (this.x - other.x),
				y: c * (this.y - other.y)});
	}

	public function computeRepulsion(other:Node):Object {
		var dist:Number = distance(other);
		var f:Number = 10000000 / (dist * dist);

		return({x: f * (this.x - other.x) / dist,
				y: f * (this.y - other.y) / dist});
	}

	public function distance(other:Node):Number {
		var xd:Number = this.x - other.x;
		var yd:Number = this.y - other.y;
		var dist:Number = Math.sqrt(xd*xd+yd*yd);
		return dist;
	}
}